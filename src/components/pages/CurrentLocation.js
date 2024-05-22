import React, { useEffect, useState } from 'react';

const CurrentLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            fetchAddress(position.coords.latitude, position.coords.longitude);
            console.log(lat, lng, "test"); 
        },
        (error) => {
            let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '사용자가 위치 정보 제공을 거부했습니다.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.';
              break;
            case error.TIMEOUT:
              errorMessage = '위치 정보를 가져오는 데 시간이 초과되었습니다.';
              break;
            default:
              errorMessage = '위치 정보를 가져오는 중 알 수 없는 오류가 발생했습니다.';
              break;
          }
          console.error("위치 정보를 가져오는 데 실패했습니다.", errorMessage);
        }
      );
    } else {
      console.error("브라우저가 Geolocation API를 지원하지 않습니다.");
    }
  }, []);

  const fetchAddress = async (lat, lng) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.status === 'OK') {
        const addressComponents = data.results[0].address_components;
        let district = '';
        for (const component of addressComponents) {
          if (component.types.includes('sublocality_level_1')) { 
            district = component.long_name;
            break;
          }
        }
        setAddress(district);
        localStorage.setItem("region",district);
        console.log(district,"현재주소");
      } else {
        console.error('Geocoding API 호출에 실패했습니다.', data.error_message);
      }
    } catch (error) {
      console.error('Geocoding API 호출에 실패했습니다.', error);
    }
  };

  return;
};

export default CurrentLocation;