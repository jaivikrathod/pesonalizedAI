import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function AddQa() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question: "",
      answer: "",
      paraphrases: [],
      isDefault: false,
      subQuestions: [],
      media: [],
    },
  });

  const { fields: paraphraseFields, append: appendParaphrase, remove: removeParaphrase } = useFieldArray({
    control,
    name: "paraphrases",
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control,
    name: "media",
  });

  const onSubmit = (data) => {
    const formattedData = {
      question: data.question,
      answer: data.answer,
      paraphrases: data.paraphrases.map((item) => item.paraphrase),
      isDefault: data.isDefault,
      subQuestions: data.subQuestions,
  };

  const formData = new FormData();
  formData.append("userid", 3);
  formData.append("QA", JSON.stringify(formattedData));

  data.media.forEach((item) => {
      if (item.file[0]) {
          formData.append("media", item.file[0]);
      }
  });

    axios
      .post("http://127.0.0.1:5000/qa/set-qa", formData)
      .then((response) => {
        alert("Data submitted successfully!");
        reset();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Add Question and Answer</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              {...register("question", { required: "Question is required" })}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
            />
            {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" {...register("isDefault")} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label className="text-sm font-medium text-gray-700">Is Default?</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Options</label>
            <select multiple {...register("subQuestions")} className="w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-300">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea {...register("answer", { required: "Answer is required" })} className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"></textarea>
            {errors.answer && <p className="text-red-500 text-sm mt-1">{errors.answer.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Paraphrases</label>
            {paraphraseFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  {...register(`paraphrases.${index}.paraphrase`, { required: "Paraphrase is required" })}
                  className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
                />
                <button type="button" onClick={() => removeParaphrase(index)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
              </div>
            ))}
            <button type="button" onClick={() => appendParaphrase({ paraphrase: "" })} className="mt-2 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600">+ Add Paraphrase</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Add Media</label>
            {mediaFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <input type="file" {...register(`media.${index}.file`, { required: "Media is required" })} className="block w-full" />
                <button type="button" onClick={() => removeMedia(index)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">-</button>
              </div>
            ))}
            <button type="button" onClick={() => appendMedia({ file: "" })} className="mt-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600">+ Add Media</button>
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
