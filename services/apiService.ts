const API_URL = 'http://192.168.86.45:7187'
class ApiService {

  async scanProduct(barcode: string) {
    try {
      console.log('Sending barcode to backend:', barcode);

      const response = await fetch(
        `${API_URL}/WeatherForecast/ScanProduct?barcode=${barcode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      console.log('Backend response:', data);

      return data;

    } catch (error) {
      console.error('Backend error:', error);
      return null;
    }
  }
}

export const apiService = new ApiService();