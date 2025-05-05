"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PlusIcon, Trash2, X } from "lucide-react";
import Steps from "./Steps"; // You should have a separate Steps.tsx component for rendering step indicators
import ResumeUploader from "./DndFileUpload"; // Assuming you have a file upload component
const skillLevels = ["Beginner", "Intermediate", "Expert"];

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import EducationList from "./ui/reorder";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// Optional: define a fallback date value
const fallbackDate = new Date();

// Zod schema for form validation
const formSchema = z.object({
  resume: z
    .instanceof(File, { message: "Resume is required" })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
  name: z.string().min(3, "Name must be at least 3 characters"),
  lname: z.string(),

  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  skills: z
    .array(
      z.object({
        skill: z.string().min(2, "Enter a skill"),
        level: z.string(),
      })
    )
    .nonempty("At least one skill is required"),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        college: z.string().min(1, "College is required"),
        startYear: z.string().min(4).max(4),
        endYear: z.string().min(4).max(4),
      })
    )
    .nonempty("At least one education entry is required"),
});

const stepSchemas = [
  z.object({
    resume: z
      .instanceof(File, { message: "Resume is required" })
      .refine((file) => file.type === "application/pdf", {
        message: "Only PDF files are allowed",
      }),
  }),
  z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
  z.object({
    skills: z
      .array(
        z.object({
          skill: z.string().min(2, "Enter a skill"),
          level: z.string(),
        })
      )
      .nonempty("At least one skill is required"),
  }),
  z.object({
    education: z
      .array(
        z.object({
          degree: z.string().min(1),
          college: z.string().min(1),
          startYear: z.string().min(4, {
            message: "Start year must be after 2015",
          }),
          endYear: z.string().max(4, {
            message: "End year must be before 2025",
          }),
        })
      )
      .nonempty("At least one education entry is required"),
  }),
];

const fullSchema = stepSchemas.reduce(
  (acc, schema) => acc.merge(schema),
  z.object({})
);

// Infer TypeScript type from Zod schema
type FormData = z.infer<typeof formSchema> & {
  newSkill: { skill: string; level: string };
  newEdu: {
    degree: "";
    college: "";
    startYear: Date | undefined;
    endYear: Date | undefined;
  };
};

const JobForm = () => {
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema as any),
    defaultValues: {
      resume: undefined,
      name: "",
      email: "",
      phone: "",
      skills: [],
      education: [],
      newSkill: { skill: "", level: "Beginner" }, // ✅ temporary input only
      newEdu: {
        degree: "",
        college: "",
        startYear: undefined,
        endYear: undefined,
      }, // ✅ temporary input only
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("form");
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      // Extract fields
      const { resume, skills, education, ...rest } = parsedData;

      // Restore scalar values
      for (const key in rest) {
        form.setValue(key as any, rest[key]);
      }

      // Restore skills
      if (skills && Array.isArray(skills)) {
        // First remove existing fields
        removeSkill();
        skills.forEach((item: any) => appendSkill(item));
      }

      // Restore education
      if (education && Array.isArray(education)) {
        removeEdu();
        education.forEach((item: any) => appendEdu(item));
      }

      // Optionally show message about missing resume
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Chrome requires returnValue to be set
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  form.watch(() => {
    localStorage.setItem("form", JSON.stringify(form.getValues()));
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const onSubmit = (data: FormData) => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      console.log("Final Submitted Data:", data);
      // You can handle API call here
    }
  };

  const steps = [
    { label: "Upload Resume", action: () => setStep(1) },
    {
      label: "Basic Info",
      action: async () => {
        const isStep1Valid = await form.trigger(["resume"]);
        isStep1Valid ? setStep(2) : "";
      },
    },
    {
      label: "Skill Set",
      action: async () => {
        const isStep1Valid = await form.trigger(["name", "email", "phone"]);
        isStep1Valid ? setStep(3) : "";
      },
    },
    {
      label: "Education",
      action: async () => {
        const isStep1Valid = await form.trigger(["skills"]);
        isStep1Valid ? setStep(4) : "";
      },
    },
    {
      label: "Summary",
      action: async () => {
        const isStep1Valid = await form.trigger(["education"]);
        isStep1Valid ? setStep(5) : "";
      },
    },
    {
      label: "Completed",
      action: async () => {
        const isStep1Valid = await form.trigger();
        isStep1Valid ? setStep(6) : "";
      },
    },
  ];

  return (
    <div className="p-4 space-y-6 ">
      <Steps items={steps} currentStep={step} />
      <Form {...form}>
        <form
          className="space-y-4 px-4 pt-14 sm:px-14"
          onSubmit={async (e) => {
            e.preventDefault();

            const currentSchema = stepSchemas[step - 1];
            const values = form.getValues();

            if (currentSchema) {
              const result = currentSchema.safeParse(values);

              if (!result.success) {
                const fieldErrors = result.error.flatten().fieldErrors;
                for (const key in fieldErrors) {
                  form.setError(key as keyof FormData, {
                    message:
                      (fieldErrors as Record<string, string[]>)[key]?.[0] ||
                      "Invalid",
                  });
                }
                return;
              }

              if (step < 5) {
                form.clearErrors();
                setStep((s) => s + 1);
              } else {
                const finalResult = fullSchema.safeParse(values);
                if (finalResult.success) {
                  console.log("Final Submission", finalResult.data);
                } else {
                  console.log(
                    "Final form errors:",
                    finalResult.error.flatten().fieldErrors
                  );
                }
              }
            } else {
              const finalResult = fullSchema.safeParse(values);
              setStep(6);
              if (finalResult.success) {
                console.log("Final Submission", finalResult.data);
              } else {
                console.log(
                  "Final form errors:",
                  finalResult.error.flatten().fieldErrors
                );
              }
            }
          }}
        >
          {step === 1 && (
            // <FormField
            //   control={form.control}
            //   name="resume"
            //   render={({ field }) => (
            //     <FormItem>
            //       <label>Upload Resume (PDF)</label>
            //       <FormControl>
            //         <input className={`text-input`}
            //           type="file"
            //           accept="application/pdf"
            //           onChange={(e) => field.onChange(e.target.files)}
            //         />
            //       </FormControl>
            //       <FormMessage />
            //     </FormItem>
            //   )}
            // />

            <ResumeUploader form={form} />
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl mb-10">Basic Informations</h3>
              <div className="grid grid-rows-2 grid-cols-2 w-fit gap-x-10 gap-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <label>First Name</label>
                      <FormControl>
                        <input
                          className={`text-input ${
                            form.getFieldState("name").error ? "err" : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lname"
                  render={({ field }) => (
                    <FormItem>
                      <label>Last Name</label>
                      <FormControl>
                        <input
                          className={`text-input ${
                            form.getFieldState("lname").error ? "err" : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label>Email</label>
                      <FormControl>
                        <input
                          className={`text-input ${
                            form.getFieldState("email").error ? "err" : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <label>Phone</label>
                      <FormControl>
                        <PhoneInput
                          style={{
                            "--react-international-phone-border-color":
                              "transperent",
                            "--react-international-phone-background-color":
                              "#f9f9f9",
                            "--react-international-phone-border": "0px",
                            "--react-international-phone-selected-dropdown-item-background-color":
                              "#ff5c35",
                          }}
                          defaultCountry="in"
                          {...field}
                          className={`text-input phone flex justify-start items-center ${
                            form.getFieldState("phone").error ? "err" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Skill Sets</h3>
              <div className="grid  grid-cols-2 w-fit gap-x-10 gap-y-5">
                <FormField
                  control={form.control}
                  name="newSkill.skill"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <input
                          className="text-input"
                          placeholder="Add Skill"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newSkill.level"
                  render={({ field }) => (
                    <FormItem className="w-48">
                      <FormControl>
                        <select className="text-input" {...field}>
                          {skillLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {skillFields.map((item, index) => {
                  const skill = form.watch(`skills.${index}.skill`);
                  const level = form.watch(`skills.${index}.level`);
                  return (
                    <div
                      key={item.id}
                      className="skill-tag flex items-center justify-content-between"
                    >
                      {skill} ({level})
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-[14px]"
                      >
                        <X />
                      </button>
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                onClick={() => {
                  const newSkill = form.getValues("newSkill");

                  if (newSkill.skill) {
                    appendSkill(newSkill);
                    form.setValue("newSkill", { skill: "", level: "Beginner" });
                    form.setValue("newSkill.skill", "");
                    form.clearErrors();
                  }
                }}
                className="btn-fill flex items-center justify-center"
              >
                <span>Add</span>{" "}
                <span className="ml-2 text-xl">
                  <PlusIcon color="#fff" />
                </span>
              </Button>
              {form.getFieldState("skills").error && (
                <p className="text-sm text-red-600 font-bold">
                  * Atleast two skill set required
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl mb-4 font-semibold">Education</h3>

              {/* New Education Input Row */}
              <div className="grid  grid-cols-2 w-fit gap-x-10 gap-y-5">
                <FormField
                  control={form.control}
                  name="newEdu.degree"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">Degree</label>
                      <FormControl>
                        <input
                          placeholder="e.g. BSc"
                          className="text-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newEdu.college"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-medium">College</label>
                      <FormControl>
                        <input
                          placeholder="e.g. Greenfield University"
                          className="text-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newEdu.startYear"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <label className="text-sm font-medium">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild className="text-input">
                          <FormControl>
                            <button
                              type="button"
                              className="text-left w-full  rounded px-3 py-2 flex items-center justify-between"
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                              <span>
                                <svg
                                  width="27"
                                  height="30"
                                  viewBox="0 0 27 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M21.3949 1.8421V4.47368M5.60547 1.8421V4.47368"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M13.4946 16.3158H13.5064M13.4946 21.579H13.5064M18.7518 16.3158H18.7636M8.2373 16.3158H8.24911M8.2373 21.579H8.24911"
                                    stroke="#F66135"
                                    stroke-width="2.63158"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M2.31543 9.73682H24.6839"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M1 15.3201C1 9.58676 1 6.72011 2.64752 4.93901C4.29505 3.1579 6.9467 3.1579 12.25 3.1579H14.75C20.0533 3.1579 22.705 3.1579 24.3525 4.93901C26 6.72011 26 9.58676 26 15.3201V15.9957C26 21.729 26 24.5957 24.3525 26.3768C22.705 28.1579 20.0533 28.1579 14.75 28.1579H12.25C6.9467 28.1579 4.29505 28.1579 2.64752 26.3768C1 24.5957 1 21.729 1 15.9957V15.3201Z"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M1.6582 9.73682H25.3424"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            captionLayout="dropdown"
                            mode="single"
                            className=" [&_.rdp-day_selected]:bg-orange-500 [&_.rdp-day_selected]:text-white [&_.rdp-day_selected:hover]:border-orange-600"
                            selected={
                              field.value ? new Date(field.value) : fallbackDate
                            }
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newEdu.endYear"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <label className="text-sm font-medium">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild className="text-input">
                          <FormControl>
                            <button
                              type="button"
                              className="text-left w-full  rounded px-3 py-2 flex items-center justify-between"
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span className="text-muted-foreground">
                                  Pick a date
                                </span>
                              )}
                              <span>
                                <svg
                                  width="27"
                                  height="30"
                                  viewBox="0 0 27 30"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M21.3949 1.8421V4.47368M5.60547 1.8421V4.47368"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M13.4946 16.3158H13.5064M13.4946 21.579H13.5064M18.7518 16.3158H18.7636M8.2373 16.3158H8.24911M8.2373 21.579H8.24911"
                                    stroke="#F66135"
                                    stroke-width="2.63158"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M2.31543 9.73682H24.6839"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M1 15.3201C1 9.58676 1 6.72011 2.64752 4.93901C4.29505 3.1579 6.9467 3.1579 12.25 3.1579H14.75C20.0533 3.1579 22.705 3.1579 24.3525 4.93901C26 6.72011 26 9.58676 26 15.3201V15.9957C26 21.729 26 24.5957 24.3525 26.3768C22.705 28.1579 20.0533 28.1579 14.75 28.1579H12.25C6.9467 28.1579 4.29505 28.1579 2.64752 26.3768C1 24.5957 1 21.729 1 15.9957V15.3201Z"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M1.6582 9.73682H25.3424"
                                    stroke="#F66135"
                                    stroke-width="1.97368"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="end"
                          side="bottom"
                        >
                          <Calendar
                            captionLayout="dropdown"
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : fallbackDate
                            }
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Education Tag List */}
              <div className="flex flex-wrap flex-col  gap-2">
                <EducationList
                  items={eduFields}
                  onReorder={(newOrder) => {
                    form.setValue("education", newOrder as any); // update form value
                  }}
                  onRemove={(index) => removeEdu(index)}
                />
                {/* {eduFields.map((edu, index) => (
                  // <div
                  //   key={index}
                  //   className="skill-tag w-fit flex items-center justify-content-center"
                  // >
                  //   <span>
                  //     <svg
                  //       width="8"
                  //       height="14"
                  //       viewBox="0 0 8 14"
                  //       fill="none"
                  //       xmlns="http://www.w3.org/2000/svg"
                  //     >
                  //       <circle cx="1.5" cy="1.5" r="1.5" fill="#F66135" />
                  //       <circle cx="1.5" cy="7" r="1.5" fill="#F66135" />
                  //       <circle cx="1.5" cy="12.5" r="1.5" fill="#F66135" />
                  //       <circle cx="6.5" cy="1.5" r="1.5" fill="#F66135" />
                  //       <circle cx="6.5" cy="7" r="1.5" fill="#F66135" />
                  //       <circle cx="6.5" cy="12.5" r="1.5" fill="#F66135" />
                  //     </svg>
                  //   </span>
                  //   <span className="mr-2">
                  //     {edu.degree} - {edu.college} ({edu.startYear}–
                  //     {edu.endYear})
                  //   </span>
                  //   <button
                  //     type="button"
                  //     onClick={() => {
                  //       removeEdu(index);
                  //     }}
                  //   >
                  //     ✕
                  //   </button>
                  // </div>
                ))} */}
              </div>
              {/* Add Button */}
              <Button
                type="button"
                className="mt-2 btn-fill uppercase"
                onClick={() => {
                  const { degree, college, startYear, endYear } =
                    form.getValues().newEdu;
                  if (degree && college && startYear && endYear) {
                    appendEdu({
                      degree,
                      college,
                      startYear: startYear.getFullYear()?.toString(),
                      endYear: endYear.getFullYear()?.toString(),
                    });
                    form.clearErrors();
                    form.setValue("newEdu.college", "");
                    form.setValue("newEdu.degree", "");
                    form.setValue("newEdu.startYear", undefined);
                    form.setValue("newEdu.endYear", undefined);
                  }
                }}
              >
                Add <PlusIcon color="#fff" />
              </Button>
              {form.getFieldState("education").error && (
                <p className="text-sm text-red-600 font-bold">
                  * Atleast one education field is required
                </p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8">
              <h2 className="text-lg font-medium mb-5">Summary</h2>
              {/* Resume Section */}
              <hr />

              <div>
                <h2 className="text-lg font-medium mb-5">Resume</h2>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {form.getValues("resume")?.name || "No file uploaded"}
                </p>
              </div>
              <hr />
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-medium mb-5">Basic Information</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">First Name</p>
                    <p className="font-semibold">{form.getValues("name")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Name</p>
                    <p className="font-semibold">{form.getValues("lname")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email Id</p>
                    <p className="font-semibold">{form.getValues("email")}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone Number</p>
                    <p className="font-semibold">{form.getValues("phone")}</p>
                  </div>
                </div>
              </div>
              <hr />
              {/* */}
              <div>
                <h2 className="text-lg font-medium mb-5"> Skill Sets</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {form
                    .getValues("skills")
                    ?.map((skill: any, index: number) => (
                      <React.Fragment key={index}>
                        <div>
                          <p className="text-gray-500">Skill {index + 1}</p>
                          <p className="font-semibold">{skill.skill}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Experience Level</p>
                          <p className="font-semibold">{skill.level}</p>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <hr />
              {/* Education */}
              <div>
                <h2 className="text-lg font-medium mb-5"> Education</h2>

                <div className="text-sm space-y-4">
                  {form
                    .getValues("education")
                    ?.map((edu: any, index: number) => (
                      <div key={index} className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-500">Degree Name</p>
                          <p className="font-semibold">{edu.degree}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">University</p>
                          <p className="font-semibold">{edu.college}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Year of Starting</p>
                          <p className="font-semibold">{edu.startYear}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Year of Completion</p>
                          <p className="font-semibold">{edu.endYear}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <hr />
              {/* Terms Agreement */}
              <div className=" text-gray-600">
                <p className="text-sm font-light">
                  By submitting this form, you confirm that all information
                  provided is accurate and complete to the best of your
                  knowledge. Any false or misleading information may result in
                  disqualification from the recruitment process or termination
                  of employment if discovered later.{" "}
                </p>
                <br />
                <p className="text-sm font-light">
                  Submission of this form does not guarantee an interview or
                  employment. Your personal data will be handled confidentially
                  and used solely for recruitment purposes in accordance with
                  Beyonds Labs LLC Privacy Policy.
                </p>
                {/* <label className="flex text-[#556171] font-semibold items-center mt-5 space-x-2"></label> */}
                <div className="flex text-[#556171] font-semibold items-center mt-5 space-x-2 text-sm">
                  <input type="checkbox" className="mt-1" required />
                  <span>
                    By submitting, you agree to our Terms & Conditions .
                  </span>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex justify-start gap-4">
                <button type="button" className="btn-outline uppercase">
                  Edit
                </button>
                <button type="submit" className="btn-fill uppercase">
                  Confirm
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-8 flex justify-center items-center flex-col">
              <h2 className="text-[24px] font-medium">
                <span className="text-[#ff5c35]">Great! </span>
                Thank You for Applying
              </h2>
              <p className="text-[16px] w-[500px] text-center">
                We appreciate your application. Our team will review it, and
                we’ll reach out soon if there’s a match. Stay tuned!
              </p>
              <button className="btn-fill uppercase ">
                {" "}
                Track Application
              </button>
            </div>
          )}

          {step < 5 && (
            <div className="flex items-end justify-end gap-2 pt-14">
              {step > 1 && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </button>
              )}
              <button className="btn-fill uppercase" type="submit">
                {step === 5 ? "Submit" : "Next"}
              </button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default JobForm;
