// Representa um Usuário no sistema.
export class User {
  constructor({ id, name, username, passwordHash, createdAt }) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = new Date(createdAt);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt.toISOString()
    };
  }
}
