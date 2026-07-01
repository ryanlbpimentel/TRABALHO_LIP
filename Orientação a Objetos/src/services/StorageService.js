export class StorageService {
  static getItem(key) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erro ao ler chave "${key}" do localStorage:`, error);
      return null;
    }
  }

  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar chave "${key}" no localStorage:`, error);
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover chave "${key}" do localStorage:`, error);
    }
  }
}
