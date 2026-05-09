import { Metadata } from "next";
import ProfileView from "./ProfileView";

export const metadata: Metadata = {
  title: "Courier Profile - Angkutin",
  description:
    "Manage your courier information, vehicle details, security settings, and notification preferences on Angkutin.",
};

export default function CourierProfilePage() {
  return <ProfileView />;
}
