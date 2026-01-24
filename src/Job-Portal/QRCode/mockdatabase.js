export const Databaseprofile  = [
    {
      id: "drive1",
      name: "John Doe",
      email: "john@licc.om",
      resumeUrl: "https://example.com/resume/john",
      status: "Checked-In",
    },
    {
      id: "drive2",
      name: "Jane Smith",
      email: "jane.smith.com",
      resumeUrl: "https://example.com/resume/jane",
      status: "Checked-In",
    },
    {
      id: "drive3",
      name: "Bob Johnson",
      email: "bob.johnsonn",
      resumeUrl: "https://example.com/resume/bob",
      status: "Checked-In",
    },
    {
      id: "drive4",
      name: "Nikita Kumari",
      email: "itwalkin123@gamil.com",
      resumeUrl: "https://example.com/resume/alice",
      status: "checked-in",
    },
  ];
  
  let currentInCabin = null;
  
  export const getProfileByUserId = (userId) =>
    Databaseprofile .find((p) => p.id === userId);
  
  export const setCurrentInCabin = (profile) => {
    currentInCabin = profile;
  };
  
  export const getCurrentInCabin = () => currentInCabin;


  
  export const getAllProfiles = () => [...Databaseprofile ];
