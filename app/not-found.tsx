import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="bg-white relative min-h-screen">
      <div className="h-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Logo>Cipher Cart</Logo>

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Looking for something?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;re sorry. The Web address you entered is not a functioning
              page on our site.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-xs space-y-4">
              <Link
                href="/"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-darkBlue/80 hover:bg-darkBlue focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-amazonOrangeDark hoverEffect"
              >
                Go to Cipher Cart&apos;s home page
              </Link>
              <Link
                href="/help"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-md text-amazonBlue bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-amazonBlue"
              >
                Help
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Visit the{" "}
              <Link
                href="/help"
                className="font-medium text-amazon-blue hover:text-blue-800"
              >
                Help section
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="font-medium text-amazon-blue hover:text-blue-800"
              >
                contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
