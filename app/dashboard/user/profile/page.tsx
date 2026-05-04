import { Metadata } from "next";
import ProfileView from "./ProfileView";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your personal information, addresses, security settings, and notification preferences on Angkutin.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
