import { useEffect } from "react";

import { useLocation } from "react-router-dom";

import { initMetaPixel, trackPageView } from "../utils/metaPixel";

const MetaPixel = () => {
  const location = useLocation();

  useEffect(() => {
    initMetaPixel();

    trackPageView();
  }, [location.pathname]);

  return null;
};

export default MetaPixel;
