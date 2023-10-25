import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  emailLabel: string;
  emailPlaceHolder: string;
  messageLabel: string;
  messagePlaceHolder: string;
  title: string;
  subTitle: string;
  buttonText: string;
};
const ContactForm = ({
  emailLabel,
  emailPlaceHolder,
  messageLabel,
  messagePlaceHolder,
  title,
  subTitle,
  buttonText,
}: ContactFormProps) => {
  return (
    <div className="py-16 bg-white">
      <div className="container">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p>{subTitle}</p>
        <div className="mb-2 mt-3">
          <label>{emailLabel}</label>
          <br />
          <Input placeholder={emailPlaceHolder} />
        </div>
        <div className="mb-2">
          <label>{messageLabel}</label>
          <br />
          <Textarea placeholder={messagePlaceHolder} />
        </div>
        <Button>{buttonText}</Button>
      </div>
    </div>
  );
};

export default ContactForm;
