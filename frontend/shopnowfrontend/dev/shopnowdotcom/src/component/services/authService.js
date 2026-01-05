export const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("userId");
    window.location.href = '/';
    window.location.reload();
}   