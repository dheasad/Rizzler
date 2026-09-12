export const formatLoginResponse = (user) => {
  if (!user) return null;
  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email || "",
      isVerified: user.isVerified,
    },
  };
};

export const formatSignupResponse = (user) => {
  if (!user) return null;
  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email || "",
      phone: user.phone || "",
      isVerified: user.isVerified,
    },
  };
};
