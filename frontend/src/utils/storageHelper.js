    // Get Super Admin data
    export const getSuperAdminData = () => {
      return {
        superAdminId: localStorage.getItem("superAdminId"),
        superToken: localStorage.getItem("superToken"),
        superAdminName: localStorage.getItem("superAdminName"),
        superAdmin: localStorage.getItem("role"),
      };
    };
        export const clearSuperAdminData = () => {
      localStorage.clear();
    };  


  // Get admin data
  export const getMasjidData = () => {
      return {
        masjidId: localStorage.getItem("masjidId"),
        masjidtoken: localStorage.getItem("masjidtoken"),
        masjidSaas: localStorage.getItem("masjidSaas"),
        role: localStorage.getItem("role"),
      };
    };
    
    export const clearMasjidData = () => {
      localStorage.clear();
    };
    
    // Get user data
export const getUserData = () => {
  return {
    userId: localStorage.getItem("userId"),
    userToken: localStorage.getItem("token"),
    name: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  };
};
export const clearUserData = () => {
  localStorage.clear();
};


