"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CircleCheck, Loader, XCircle } from "lucide-react";
import { useWatch } from "react-hook-form";
import Image from "next/image";
import { set } from "date-fns";

const ResumeUploader = ({ form }: { form: any }) => {
  const [progress, setProgress] = useState(0);

  const CLOUD_NAME = "dvvqvjzyw";
  const UPLOAD_PRESET = "byond_labs";

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        form.setValue(
          "resumeMeta",
          { name: file.name, size: file.size, type: file.size },
          { shouldValidate: true }
        );
        await uploadResumeToCloudinary(file);
      }
    },
    [form]
  );

  const resumeValue: { name: string; size: number; type: string } | null =
    useWatch({
      control: form.control,
      name: "resumeMeta",
    });

  const resumeUrl = useWatch({
    control: form.control,
    name: "resume",
  });

  useEffect(() => {
    resumeUrl ? setProgress(100) : setProgress(0);
  }, [resumeUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const uploadResumeToCloudinary = async (file: File) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (e) => {
      const percent = (e.loaded / e.total) * 100;
      setProgress(percent);
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const resumeUrl = response.secure_url;
        form.setValue("resume", resumeUrl, { shouldValidate: true });

        localStorage.setItem("resume", resumeUrl);

        localStorage.setItem(
          "resumeMeta",
          JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type,
          })
        );
      } else {
        console.error("Upload failed", xhr.responseText);
      }
    };

    xhr.send(formData);
  };

  return (
    <div className="w-[530px] space-y-8">
      <h3 className="text-xl mb-10">Upload Resume</h3>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer py-20 justify-center rounded-xl border-[2.36px] gap-10 border-dashed ${
          isDragActive ? "border-blue-600 bg-blue-50" : "border-[#CBD0DC]"
        } bg-white px-3 py-6 text-sm transition hover:border-gray-400`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-x-2">
          <Image
            src={"/svg/cloud-upload-icon.svg"}
            alt="upload icon"
            width={28}
            height={28}
          />
          <div className="text-center space-y-2 py-7">
            <h6 className="text-[16px] font-medium ">
              Choose a file or drag & drop it here
            </h6>
            <p className="text-[14px] text-[#A9ACB4]">
              Please Upload Your Resume (PDF formats only)
            </p>
          </div>
          <a className="btn-outline flex items-center justify-center">
            Browse File
          </a>
        </div>
      </div>
      <FormField
        control={form.control}
        name="resume"
        render={(field) => (
          <FormItem className="space-y-8">
            <FormControl>
              <input type="text" {...field} className="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {resumeValue && (
        <div className="border relative border-orange-10 bg-[#FFF5F2] h-[125.83606719970703px] flex flex-col items-start justify-center px-8 rounded-[17px]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <Image
              src="/svg/pdf-icon.png"
              alt="PDF"
              width={55.44}
              height={53.57}
            />
            <div className="truncate">
              <p className="text-sm font-medium truncate">{resumeValue.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {((resumeValue.size / 1024) * (progress / 100)).toFixed(0)} KB
                of {(resumeValue.size / 1024).toFixed(0)} KB &middot;{" "}
                {progress < 100 ? (
                  <>
                    <Loader color="#F66135" className="w-4 h-4 ml-1" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <CircleCheck
                      fill="#3EBF8F"
                      color="#fff"
                      className="w-4 h-4 ml-1"
                    />
                    Complete
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setProgress(0);
              form.setValue("resume", "");
              form.setValue("resumeMeta", "");
            }}
            className="absolute text-gray-400 hover:text-gray-600 top-5 right-5"
          >
            <XCircle color="#F66135" size={16} />
          </button>

          {progress < 100 && (
            <div className="flex items-center mt-5">
              <div className="max-w-full w-[450px] h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
