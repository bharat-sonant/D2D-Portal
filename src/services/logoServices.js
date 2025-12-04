import CityCommonData from '../common/cityCommonData.json';
import { images } from '../assets/css/imagePath'; // fallback logo

export function getCityLogo(city) {
  if (!city) return images.wevoisLogo;

  const normalizedCity = city.toLowerCase();
  const cityInfo = CityCommonData[normalizedCity];
  if (!cityInfo || !cityInfo.cityLogo) {
    console.warn("Logo not found for:", city);
    return images.wevoisLogo;
  }

  // Public folder: direct path
  return `${process.env.PUBLIC_URL}/CityImages/${cityInfo.cityLogo}`;
}
