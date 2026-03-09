import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export const passwordRules = [
  { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least one number", test: (p: string) => /\d/.test(p) },
  { label: "At least one special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export function isPasswordValid(password: string) {
  return passwordRules.every((r) => r.test(password));
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  if (!password) return null;

  return (
    <div className="space-y-1 mt-2">
      {passwordRules.map((rule) => {
        const passed = rule.test(password);
        return (
          <div key={rule.label} className="flex items-center gap-2 text-xs">
            {passed ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-destructive" />
            )}
            <span className={passed ? "text-green-500" : "text-destructive"}>
              {rule.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;
