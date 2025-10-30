export interface IDialogProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export interface ISelectProps {
  name: string;
  value?: string;
  setValue?: (value: string) => void;
  defaultOption?: string;
  options: string[];
  className?: string;
}
