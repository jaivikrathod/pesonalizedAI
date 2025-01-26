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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "paraphrases",
  });

  const onSubmit = (data) => {
    const formattedData = {
      question: data.question,
      answer: data.answer,
      paraphrases: data.paraphrases.map((item) => item.paraphrase),
      userid: 3,
    };

    axios
      .post("http://127.0.0.1:5000/qa/set-qa", formattedData)
      .then((response) => {
        alert("Data submitted successfully!");
        console.log(response.data);
        reset();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Add Question and Answer
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Question
            </label>
            <input
              type="text"
              {...register("question", { required: "Question is required" })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.question ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.question && (
              <p className="text-red-500 text-sm mt-1">
                {errors.question.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Answer
            </label>
            <textarea
              {...register("answer", { required: "Answer is required" })}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.answer ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.answer && (
              <p className="text-red-500 text-sm mt-1">{errors.answer.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paraphrases
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  {...register(`paraphrases.${index}.paraphrase`, {
                    required: "Paraphrase is required",
                  })}
                  placeholder="Enter paraphrase"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.paraphrases?.[index]?.paraphrase
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ paraphrase: "" })}
              className="mt-2 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
            >
              + Add Paraphrase
            </button>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
