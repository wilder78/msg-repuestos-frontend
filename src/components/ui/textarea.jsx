import * as React from "react";
import { cn } from "../../lib/utils"; // Verifica si tu ruta es ../../lib/utils o solo ./utils

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm ring-offset-background",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        "resize-none",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };

// import * as React from "react";

// import { cn } from "./utils";

// function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
//   return (
//     <textarea
//       data-slot="textarea"
//       className={cn(
//         "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// export { Textarea };
