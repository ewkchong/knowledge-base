import { useRouteError } from "react-router-dom";
import React from 'react';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="px-6 py-32" id="error-page">
      <h1 className="text-center text-3xl font-bold tracking-tight mx-auto max-w-2xl">Oops!</h1>
      <p className="text-center my-6">Sorry, an unexpected error has occurred.</p>
      <p className="text-center my-6">
        <i className="text-center text-gray-700">{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
