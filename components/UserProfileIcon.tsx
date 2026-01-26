"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";

function UserProfileIcon() {
  return (
    <div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
          },
        }}
      />
    </div>
  );
}

export default UserProfileIcon;
