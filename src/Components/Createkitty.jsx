import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

const CreateKitty = () => {
  const examples = [
    "Everyone in your flat share lost track of who paid what and when this month.",
    "You are on a ski trip with friends and want to keep track of your expenses.",
    "The party is over and you want to split the costs with your friends.",
    "You are organising a bachelorette party or a baby shower.",
    "You went on a group holiday and want to settle up afterwards.",
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      eventName: "",
      currency: "INR",
      participants: [
        { name: "", email: "" }, // You
        { name: "" }, // Person 2
      ],
      example: examples[0],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "participants",
  });

  const currentExample = watch("example");

  const getRandomExample = () => {
    let random;
    do {
      random = examples[Math.floor(Math.random() * examples.length)];
    } while (random === currentExample);
    setValue("example", random);
  };

  const onSubmit = (data) => {
    console.log("✅ Kitty Data:", data);
  };

  return (
    <div className="bg-[#dfebed] h-screen flex items-center justify-center py-10 px-12">
      <div className="container mx-auto rounded-2xl shadow max-w-[750px] bg-[#fffbf2]">
        <div className="border-b border-[#cdc2af] bg-white rounded-t-2xl">
          <h1 className="text-2xl font-medium font-raleway px-4 py-4">
            Create a new Kitty
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 py-4">
          {/* LEFT FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Event Name */}
            <div className="space-y-2 flex flex-col ">
              <label className="font-light font-sans text-lg">Event name</label>
              <input
                {...register("eventName", {
                  required: "Event name is required",
                })}
                className="border border-[#cdc2af]  rounded px-3 py-2 max-w-[322px] shadow-1"
                placeholder="Ski Trip"
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm">
                  {errors.eventName.message}
                </p>
              )}
            </div>

            {/* Currency */}
            <div className="flex flex-col space-y-2">
              <label className="font-light font-sans mb-1">
                Home Currency{" "}
              </label>
              <select
                {...register("currency", { required: "Currency is required" })}
                className="border border-[#cdc2af] rounded px-3 py-2 max-w-[322px] bg-[#ebe6dd]  shadow-1"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            {/* Participants */}
            <div className="flex flex-col space-y-4">
              <label className="font-normal font-montserrat mb-2">
                Participants
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 flex flex-col">
                  <p className=" font-light font-sans mb-1">
                    {index === 0 ? "You" : `Person ${index + 1}`}
                  </p>
                  <input
                    {...register(`participants.${index}.name`, {
                      required: "Name is required",
                    })}
                    className="border border-[#cdc2af] rounded p-2  mb-2  max-w-[322px]"
                    placeholder={index === 0 ? "Your name" : "Name"}
                  />
                  {index === 0 && (
                    <input
                      {...register(`participants.${index}.email`)}
                      className="border border-[#cdc2af] rounded p-2 max-w-[322px]"
                      placeholder="Your email (recommended)"
                    />
                  )}
                  {errors.participants?.[index]?.name && (
                    <p className="text-red-500 text-sm">
                      {errors.participants[index].name.message}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <button
                  type="button"
                  onClick={() => append({ name: "" })}
                  className="bg-[#ebe6dd] text-gray-800 px-3 py-1 rounded-2xl whitespace-nowrap shadow-2xl"
                >
                  + Add new person
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300"
            >
              Create Kitty
            </button>
          </form>

          {/* RIGHT SIDE EXAMPLES */}
          <div className="max-w-[280px] space-y-2 justify-self-end-safe">
            <h2 className="text-xl font-normal space-y-2 font-montserrat">
              Good examples for creating a Kitty
            </h2>
            <blockquote className="border-l-4 border-gray-300 pl-3 font-raleway  text-gray-700">
              {currentExample}
            </blockquote>
            <button
              type="button"
              onClick={getRandomExample}
              className="mt-3 bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl  hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 inset-shadow-2xs"
            >
              New example
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateKitty;
