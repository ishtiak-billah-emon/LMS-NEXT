"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { FaFacebook, FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";
import { authService } from "@/services/auth.services";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const roleColors = {
  student: "bg-indigo-50 text-indigo-700",
  teacher: "bg-emerald-50 text-emerald-700",
  admin: "bg-rose-50 text-rose-700",
  owner: "bg-amber-50 text-amber-700",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("") || "U";

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-900">{value || "-"}</dd>
    </div>
  );
}

function normalizeUrl(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function StudentProfile({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    userName: user?.userName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    class: user?.class || "",
    institutionName: user?.institutionName || "",
    location: user?.location || "",
    bio: user?.bio || "",
    socialLinks: {
      facebook: user?.socialLinks?.facebook || "",
      twitter: user?.socialLinks?.twitter || "",
      linkedin: user?.socialLinks?.linkedin || "",
      github: user?.socialLinks?.github || "",
      website: user?.socialLinks?.website || "",
    },
  });

  const handleChange = (field, sub) => (e) => {
    const val = e.target.value;
    if (sub) {
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [sub]: val },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: val }));
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();

      if (form.fullName?.trim()) fd.append("fullName", form.fullName.trim());
      if (form.userName?.trim()) fd.append("userName", form.userName.trim());
      if (form.email?.trim()) fd.append("email", form.email.trim());
      if (form.phone?.trim()) fd.append("phone", form.phone.trim());
      if (form.class?.trim()) fd.append("class", form.class.trim());
      if (form.institutionName?.trim())
        fd.append("institutionName", form.institutionName.trim());
      if (form.location?.trim()) fd.append("location", form.location.trim());
      if (form.bio?.trim()) fd.append("bio", form.bio.trim());

      const socials = {};
      Object.entries(form.socialLinks).forEach(([key, value]) => {
        if (value?.trim()) socials[key] = value.trim();
      });
      if (Object.keys(socials).length) {
        fd.append("socialLinks", JSON.stringify(socials));
      }
      if (avatarFile) fd.append("avatar", avatarFile);

      await authService.updateProfile(fd);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const socialFields = [
    { key: "facebook", label: "Facebook", Icon: FaFacebook },
    { key: "twitter", label: "Twitter", Icon: FaTwitter },
    { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
    { key: "github", label: "GitHub", Icon: FaGithub },
    { key: "website", label: "Website", Icon: FaGlobe },
  ];
  const socialLinks = user?.socialLinks || {};
  const socialList = socialFields.map((field) => ({
    ...field,
    value: socialLinks[field.key] || "",
  }));

  const profileFields = [
    { label: "Full name", value: user?.fullName },
    { label: "Username", value: user?.userName ? `@${user.userName}` : "" },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { label: "Class", value: user?.class },
    { label: "Institution", value: user?.institutionName },
    { label: "Location", value: user?.location },
    { label: "Role", value: user?.role },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your personal information and learning identity.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Pencil size={16} className="mr-2" />
          Edit profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        {/* Identity card */}
        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-6 text-center">
          <Avatar className="size-28">
            <AvatarImage src={user?.avatar || ""} alt={user?.fullName} />
            <AvatarFallback className="text-3xl">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold text-slate-950">
            {user?.fullName}
          </h2>
          <p className="text-sm text-slate-500">@{user?.userName}</p>
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              roleColors[user?.role] || "bg-slate-100 text-slate-700"
            }`}
          >
            {user?.role}
          </span>
          <p className="mt-4 text-sm text-slate-600">
            {user?.bio || "No bio yet."}
          </p>
          <div className="mt-5 w-full space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Class
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {user?.class || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Institution
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {user?.institutionName || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Location
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {user?.location || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-950">Details</h3>
          <dl className="mt-4 grid gap-5 sm:grid-cols-2">
            {profileFields.map((field) => (
              <DetailRow key={field.label} label={field.label} value={field.value} />
            ))}
          </dl>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h4 className="text-sm font-semibold text-slate-950">
              Social links
            </h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {socialList.map(({ key, label, Icon, value }) => {
                const href = normalizeUrl(value);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={15} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">
                        {label}
                      </span>
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-[60%] truncate text-sm text-indigo-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">Not provided</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            setError("");
            setAvatarFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your details and profile picture.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={avatarPreview} alt={form.fullName} />
                <AvatarFallback>{getInitials(form.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
                >
                  Change photo
                </Label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatar}
                />
                <p className="mt-1 text-xs text-slate-400">
                  JPG, PNG or WEBP.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  value={form.userName}
                  onChange={handleChange("userName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={form.class}
                  onChange={handleChange("class")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution</Label>
                <Input
                  id="institutionName"
                  value={form.institutionName}
                  onChange={handleChange("institutionName")}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={handleChange("location")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={handleChange("bio")}
                maxLength={500}
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Tell us about yourself"
              />
              <p className="text-right text-xs text-slate-400">
                {form.bio.length}/500
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.socialLinks.facebook}
                  onChange={handleChange("socialLinks", "facebook")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={form.socialLinks.twitter}
                  onChange={handleChange("socialLinks", "twitter")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={form.socialLinks.linkedin}
                  onChange={handleChange("socialLinks", "linkedin")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={form.socialLinks.github}
                  onChange={handleChange("socialLinks", "github")}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.socialLinks.website}
                  onChange={handleChange("socialLinks", "website")}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
