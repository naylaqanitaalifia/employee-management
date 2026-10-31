import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiConfig } from "@/config/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as faceapi from "@vladmandic/face-api";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { PiCheckBold, PiXBold } from "react-icons/pi";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void; // function yang menerima boolean dan tidak mengembalikan nilai.
  employeeId: string;
  action: "clock_out" | "clock_in";
}

type ScanStatus =
  | "loading-reference"
  | "scanning"
  | "detected"
  | "verifying"
  | "not-detected"
  | "verified"
  | "not-verified"
  | "reference-error";

export function ScanDialog({ open, onOpenChange, employeeId, action }: Props) {
  const queryClient = useQueryClient();

  const videoRef = useRef<HTMLVideoElement>(null); // Ref untuk mengakses element <video>
  const streamRef = useRef<MediaStream | null>(null); // Ref untuk menyimpan stream kamera

  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [scanStatus, setScanStatus] = useState<ScanStatus>("scanning");
  // const [faceBox, setFaceBox] = useState<faceapi.Box | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    data: employeeDetail,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
  } = useQuery({
    queryKey: ["employee-detail", employeeId], // Tanpa employeeId, react-query bakal nganggep semua pemanggilan ScanDialog (buat employee manapun) itu "data yang sama", jadi kalau suatu saat dipakai buat employee lain, bisa kebawa cache employee sebelumnya
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiConfig.API_URL}/employees/${employeeId}`,
      );

      return data.data;
    },
    enabled: open && !!employeeId, // Fetch kalo dialog dibuka dan employeeId ada, supaya ga fetch terus menerus
  });

  const isFaceInFrame = (box: faceapi.Box) => {
    if (!videoRef.current) return false;

    const video = videoRef.current;

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;

    // Titik tengah wajah
    const faceCenterX = box.x + box.width / 2;
    const faceCenterY = box.y + box.height / 2;

    // Ukuran minimal wajah
    const minFaceWidth = videoWidth * 0.2;
    const minFaceHeight = videoHeight * 0.2;

    if (box.width < minFaceWidth || box.height < minFaceHeight) {
      return false;
    }

    // Ukuran oval berdasarkan h-72 w-56
    const ovalWidth = 224;
    const ovalHeight = 288;

    // Ukuran video yang tampil di layar
    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;

    if (!displayWidth || !displayHeight) {
      return false;
    }

    // object-cover pakai SATU scale factor yang sama buat X & Y,
    // diambil dari sisi yang paling "nutupin" container
    const coverScale = Math.max(
      displayWidth / videoWidth,
      displayHeight / videoHeight,
    );

    const ovalWidthInVideo = ovalWidth / coverScale;
    const ovalHeightInVideo = ovalHeight / coverScale;

    // Area oval panduan
    const ovalCenterX = videoWidth / 2;
    const ovalCenterY = videoHeight / 2;

    // Normalisasi posisi wajah terhadap oval
    const normalizedX = (faceCenterX - ovalCenterX) / (ovalWidthInVideo / 2);
    const normalizedY = (faceCenterY - ovalCenterY) / (ovalHeightInVideo / 2);

    // Cek apakah titik tengah wajah berada di dalam oval
    return normalizedX ** 2 + normalizedY ** 2 <= 1;
  };

  const getFaceDescriptor = async () => {
    if (!videoRef.current) return null;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        }),
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return null;
    }

    if (!isFaceInFrame(detection.detection.box)) {
      return null;
    }

    return detection.descriptor;
  };

  const getReferenceDescriptor = async (photoUrl: string) => {
    const image = await faceapi.fetchImage(photoUrl);

    const detection = await faceapi
      .detectSingleFace(
        image,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        }),
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return null;
    }

    return detection.descriptor;
  };

  const handleVerifyFace = async () => {
    if (isVerifying) return;

    try {
      setIsVerifying(true);
      setScanStatus("verifying");

      const currentDescriptor = await getFaceDescriptor();

      if (!currentDescriptor) {
        setScanStatus("not-detected");
        return;
      }

      const photoUrl = employeeDetail?.photo;

      if (!photoUrl) {
        setScanStatus("reference-error");
        toast.error("Reference photo not available. Contact admin.");
        return;
      }

      const referenceDescriptor = await getReferenceDescriptor(photoUrl);

      if (!referenceDescriptor) {
        console.log("Reference face not detected");
        setScanStatus("not-verified");

        toast.error("Failed to load reference face. Contact admin.");
        return;
      }

      const labeledDescriptor = new faceapi.LabeledFaceDescriptors("person 1", [
        referenceDescriptor,
      ]);

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptor, 0.4);

      const result = faceMatcher.findBestMatch(currentDescriptor);

      console.log("Recognition result:", result);

      if (result.label === "person 1") {
        setScanStatus("verified");
      } else {
        setScanStatus("not-verified");
      }
    } catch (error) {
      console.error("Failed to recognize face:", error);
      setScanStatus("not-verified");
      toast.error("Face verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // const clockIn = useMutation({
  //   mutationFn: async () => {
  //     const { data } = await axios.post(
  //       `${apiConfig.API_URL}/attendances/clock-in`,
  //     );

  //     return data;
  //   },
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({
  //       queryKey: ["clock-in"],
  //     });

  //     toast.success("Clock in successfully");

  //     onOpenChange(false);
  //   },

  //   onError: (error) => {
  //     if (axios.isAxiosError(error)) {
  //       const message = error.response?.data?.message || "An unexpected error";
  //       toast.error(message);
  //     } else {
  //       toast.error("An unexpected error occurred");
  //     }
  //   },
  // });

  // const clockOut = useMutation({
  //   mutationFn: async () => {
  //     const { data } = await axios.post(
  //       `${apiConfig.API_URL}/attendances/clock-out`,
  //     );

  //     return data;
  //   },
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({
  //       queryKey: ["clock-out"],
  //     });

  //     toast.success("Clock out successfully");

  //     onOpenChange(false);
  //   },
  //   onError: (error) => {
  //     if (axios.isAxiosError(error)) {
  //       const message = error.response?.data?.message || "An unexpected error";
  //       toast.error(message);
  //     } else {
  //       toast.error("An unexpected error occurred");
  //     }
  //   },
  // });

  const attendanceMutation = useMutation({
    mutationFn: async () => {
      const endpoint =
        action === "clock_in"
          ? "/attendances/clock-in"
          : "/attendances/clock-out";

      const { data } = await axios.post(`${apiConfig.API_URL}${endpoint}`);

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["attendance-today"],
      });

      toast.success(
        action === "clock_in"
          ? "Clock in successfully"
          : "Clock out successfully",
      );

      onOpenChange(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "An unexpected error";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const handleConfirm = async () => {
    if (scanStatus !== "verified" || attendanceMutation.isPending) return;

    attendanceMutation.mutate();
  };

  useEffect(() => {
    if (!open || !employeeId || isLoadingEmployee || isErrorEmployee) return; // Kalau dialog tertutup atau employeeId gada, jangan jalankan kamera

    if (!employeeDetail?.photo) {
      setScanStatus("reference-error");
      return;
    }

    let cancelled = false;

    // Function untuk menyalakan kamera
    const startCamera = async () => {
      try {
        // Meminta akses kamera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // Menggunakan kamera depan
          audio: false, // Tanpa audio
        });

        // Load model face detector terlebih dahulu
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        // Simpan stream kamera
        streamRef.current = stream;

        // Kalau element video sudah ada
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Tampilkan kamera ke element <video>

          // Tunggu video sampai siap
          await videoRef.current.play();
        }

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());

          if (videoRef.current?.srcObject === stream) {
            videoRef.current.srcObject = null;
          }

          return;
        }

        setScanStatus("scanning");

        // Mulai deteksi wajah
        const detectFace = async () => {
          const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 416,
              scoreThreshold: 0.5,
            }),
          );

          const faceInFrame = detection && isFaceInFrame(detection.box);

          if (faceInFrame) {
            setScanStatus((currentStatus) => {
              // Kalau sudah verifying, verified, atau not-verified,
              // jangan ulangi proses selama wajah masih di dalam oval.
              if (
                currentStatus === "verifying" ||
                currentStatus === "verified" ||
                currentStatus === "reference-error"
              ) {
                return currentStatus;
              }

              return "detected";
            });
          } else {
            setScanStatus((currentStatus) => {
              if (currentStatus === "reference-error") return currentStatus;
              return "not-detected";
            });
          }
        };

        detectionIntervalRef.current = setInterval(detectFace, 500);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "NotAllowedError") {
            toast.error(
              "Camera access denied. Please allow camera permission.",
            );
          } else if (error.name === "NotFoundError") {
            toast.error("No camera found on this device.");
          } else {
            toast.error("Failed to access camera. Please try again.");
          }
        } else {
          toast.error(
            "An unexpected error occurred while accessing the camera.",
          );
        }
      }
    };

    // Jalankan kamera
    startCamera();

    // Jalankan saat dialog ditutup / component di-unmount
    return () => {
      cancelled = true;

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }

      streamRef.current?.getTracks().forEach((track) => track.stop()); // Matikan semua track kamera

      streamRef.current = null; // Kosongkan stream
    };
  }, [open, employeeId, employeeDetail, isLoadingEmployee, isErrorEmployee]); // useEffect dijalankan saat open berubah atau employeeDetail berubah

  useEffect(() => {
    if (open && isErrorEmployee) {
      setScanStatus("reference-error");
      toast.error("Failed to load employee data. Contact admin.");
    }
  }, [open, isErrorEmployee]);

  useEffect(() => {
    if (scanStatus !== "detected") return;
    handleVerifyFace();
  }, [scanStatus]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Verify Attendance</DialogTitle>
          <DialogDescription>
            Position your face inside the frame to verify your identity.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y overflow-scroll">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <video
              ref={videoRef} // Hubungkan <video> dengan videoRef
              autoPlay // Video langsung berjalan
              playsInline // Video tetap inline di mobile
              muted // Tanpa audio
              className="h-full w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* {faceBox && (
              <div
                className="pointer-events-none absolute border-2 border-green-500"
                style={{
                  left: `${(faceBox.x / videoRef.current!.videoWidth) * 100}%`,
                  top: `${(faceBox.y / videoRef.current!.videoHeight) * 100}%`,
                  width: `${(faceBox.width / videoRef.current!.videoWidth) * 100}%`,
                  height: `${(faceBox.height / videoRef.current!.videoHeight) * 100}%`,
                }}
              />
            )} */}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`${scanStatus === "detected" || scanStatus === "verified" ? "border-green-500" : "border-white/80"} h-72 w-56 rounded-[50%] border-2 `}
              />
            </div>
          </div>

          <div className="flex justify-center my-4">
            {scanStatus === "loading-reference" && (
              <Badge variant="warning" appearance="light" shape="circle">
                Loading your profile...
              </Badge>
            )}

            {scanStatus === "reference-error" && (
              <Badge variant="destructive" appearance="light" shape="circle">
                <PiXBold />
                Failed to load reference photo
              </Badge>
            )}

            {scanStatus === "scanning" && (
              <Badge variant="warning" appearance="light" shape="circle">
                Scanning for face...
              </Badge>
            )}

            {scanStatus === "detected" && (
              <Badge variant="success" appearance="light" shape="circle">
                <PiCheckBold />
                Face detected
              </Badge>
            )}

            {scanStatus === "verifying" && (
              <Badge variant="warning" appearance="light" shape="circle">
                Verifying face...
              </Badge>
            )}

            {scanStatus === "not-detected" && (
              <Badge variant="destructive" appearance="light" shape="circle">
                <PiXBold />
                Face not detected
              </Badge>
            )}

            {scanStatus === "verified" && (
              <Badge variant="success" appearance="light" shape="circle">
                <PiCheckBold />
                Face verified
              </Badge>
            )}

            {scanStatus === "not-verified" && (
              <Badge variant="destructive" appearance="light" shape="circle">
                <PiXBold />
                Face doesn't match
              </Badge>
            )}
          </div>

          <Button
            className="w-full"
            disabled={scanStatus !== "verified" || attendanceMutation.isPending}
            onClick={handleConfirm}
          >
            {attendanceMutation.isPending
              ? action === "clock_in"
                ? "Clocking in..."
                : "Clocking out..."
              : action === "clock_in"
                ? "Confirm Clock In"
                : "Confirm Clock Out"}
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
