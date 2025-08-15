import { AlertCircle } from "lucide-react";

export function DatabaseError({ message }) {
  return (
    <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Database Error</h3>
        <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
        <p className="text-sm text-red-500 dark:text-red-400">
          Please try again or contact the administrator if the problem persists.
        </p>
      </div>
    </div>
  );
}
