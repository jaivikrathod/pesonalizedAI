import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function AddQa() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: "",
      answer: "",
      paraphrases: [],
      isDefault: false,
      selectedOptions: [],
      answerType: "text",
      answerContent: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "paraphrases",
  });

  const answerType = watch("answerType");

  const onSubmit = (data) => {
    const formattedData = {
      question: data.question,
      answer: data.answerType === "text" ? data.answerContent : "",
      media: data.answerType !== "text" ? data.answerContent : "",
      paraphrases: data.paraphrases.map((item) => item.paraphrase),
      userid: 3,
      isDefault: data.isDefault,
      selectedOptions: data.selectedOptions,
    };

    console.log(formattedData);
    // axios
    //   .post("http://127.0.0.1:5000/qa/set-qa", formattedData)
    //   .then((response) => {
    //     alert("Data submitted successfully!");
    //     console.log(response.data);
    //     reset();
    //   })
    //   .catch((error) => {
    //     console.error("Error submitting form:", error);
    //   });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-4/5 max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Question and Answer</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              {...register("question", { required: "Question is required" })}
              className={`mt-1 block w-full px-4 py-2 border ${errors.question ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Is Default?</label>
            <label className="switch">
              <input type="checkbox" {...register("isDefault")} />
              <span className="slider round"></span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Options</label>
            <select multiple {...register("selectedOptions")} className="w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Answer Type</label>
            <select {...register("answerType")} className="w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="text">Text</option>
              <option value="media">Image/PDF/Video</option>
            </select>
          </div>

          <div>
            {answerType === "text" && (
              <textarea {...register("answerContent", { required: "Answer content is required" })} className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            )}
            {answerType === "media" && (
              <input type="file" {...register("answerContent", { required: "Media is required" })} className="mt-1 block w-full" />
            )}
            {errors.answerContent && <p className="text-red-500 text-sm mt-1">{errors.answerContent.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Paraphrases</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  {...register(`paraphrases.${index}.paraphrase`, { required: "Paraphrase is required" })}
                  placeholder="Enter paraphrase"
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ paraphrase: "" })} className="mt-2 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600">+ Add Paraphrase</button>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 w-full">Submit</button>
            <button type="button" onClick={() => reset()} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 w-full">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}