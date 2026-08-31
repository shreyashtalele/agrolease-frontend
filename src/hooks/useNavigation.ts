import { useNavigate, useLocation } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const goTo = (path: string) => {
    navigate(path);
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
      return {
        label: value.charAt(0).toUpperCase() + value.slice(1),
        to,
        isLast: index === pathnames.length - 1,
      };
    });
    return breadcrumbs;
  };

  return { goBack, goTo, getBreadcrumbs, currentPath: location.pathname };
};
