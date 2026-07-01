import http.server
import socketserver
import json
import sqlite3
import os
import urllib.parse
import re

PORT = 3000
DB_FILE = 'database.db'

def init_db():
    print("Inicializando banco de dados SQLite...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT NOT NULL,
            status TEXT NOT NULL,
            deadline TEXT NOT NULL,
            created_at TEXT NOT NULL,
            completed_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Banco de dados configurado com sucesso!")

class RequestHandler(http.server.BaseHTTPRequestHandler):
    def row_to_camel(self, row):
        d = dict(row)
        mapping = {'user_id': 'userId', 'created_at': 'createdAt', 'completed_at': 'completedAt'}
        return {mapping.get(k, k): v for k, v in d.items()}

    def get_db(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def get_auth_user_id(self):
        auth_header = self.headers.get('Authorization')
        if not auth_header:
            return None
        return auth_header.strip()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == '/api/tasks':
            user_id = self.get_auth_user_id()
            if not user_id:
                self.send_json({'error': 'Não autorizado'}, 401)
                return

            conn = self.get_db()
            cursor = conn.cursor()
            try:
                cursor.execute(
                    'SELECT * FROM tasks WHERE user_id = ?', 
                    (user_id,)
                )
                rows = cursor.fetchall()
                tasks = [self.row_to_camel(row) for row in rows]
                self.send_json(tasks, 200)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            finally:
                conn.close()
            return

        file_path = path
        if file_path == '/':
            file_path = '/index.html'

        cleaned_path = os.path.normpath(file_path).lstrip('\\/')
        
        if os.path.exists(cleaned_path) and os.path.isfile(cleaned_path):
            content_type = 'text/plain'
            if cleaned_path.endswith('.html'):
                content_type = 'text/html; charset=utf-8'
            elif cleaned_path.endswith('.css'):
                content_type = 'text/css; charset=utf-8'
            elif cleaned_path.endswith('.js'):
                content_type = 'application/javascript; charset=utf-8'
            elif cleaned_path.endswith('.svg'):
                content_type = 'image/svg+xml'
            elif cleaned_path.endswith('.png'):
                content_type = 'image/png'
            elif cleaned_path.endswith('.ico'):
                content_type = 'image/x-icon'

            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.end_headers()
            with open(cleaned_path, 'rb') as fh:
                self.wfile.write(fh.read())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write("<h1>404 - Página não encontrada</h1>".encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            body = json.loads(post_data) if post_data else {}
        except json.JSONDecodeError:
            self.send_json({'error': 'JSON inválido'}, 400)
            return

        path = self.path

        if path == '/api/register':
            name = body.get('name')
            username = body.get('username')
            password_hash = body.get('passwordHash')

            if not name or not username or not password_hash:
                self.send_json({'error': 'Campos obrigatórios ausentes.'}, 400)
                return

            normalized_username = username.strip().lower()

            conn = self.get_db()
            cursor = conn.cursor()
            try:
                cursor.execute('SELECT id FROM users WHERE username = ?', (normalized_username,))
                if cursor.fetchone():
                    self.send_json({'error': 'Este nome de usuário já está sendo utilizado.'}, 400)
                    return

                new_user_id = body.get('id') or str(sqlite3.Row)
                cursor.execute(
                    'INSERT INTO users (id, name, username, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
                    (new_user_id, name.strip(), normalized_username, password_hash, body.get('createdAt'))
                )
                conn.commit()
                self.send_json({'id': new_user_id, 'name': name, 'username': normalized_username}, 201)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            finally:
                conn.close()
            return

        elif path == '/api/login':
            username = body.get('username')
            password_hash = body.get('passwordHash')

            if not username or not password_hash:
                self.send_json({'error': 'Campos obrigatórios ausentes.'}, 400)
                return

            normalized_username = username.strip().lower()

            conn = self.get_db()
            cursor = conn.cursor()
            try:
                cursor.execute(
                    'SELECT * FROM users WHERE username = ?', 
                    (normalized_username,)
                )
                user_row = cursor.fetchone()
                
                if not user_row:
                    self.send_json({'error': 'Usuário não encontrado.'}, 404)
                    return
                
                user = dict(user_row)
                if user['password_hash'] != password_hash:
                    self.send_json({'error': 'Senha incorreta.'}, 401)
                    return

                self.send_json({
                    'id': user['id'],
                    'name': user['name'],
                    'username': user['username'],
                    'createdAt': user['created_at']
                }, 200)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            finally:
                conn.close()
            return

        elif path == '/api/tasks':
            user_id = self.get_auth_user_id()
            if not user_id:
                self.send_json({'error': 'Não autorizado'}, 401)
                return

            title = body.get('title')
            description = body.get('description', '')
            priority = body.get('priority', 'MEDIA')
            deadline = body.get('deadline')

            if not title or not deadline:
                self.send_json({'error': 'Título e Data Limite são obrigatórios.'}, 400)
                return

            conn = self.get_db()
            cursor = conn.cursor()
            try:
                task_id = body.get('id')
                created_at = body.get('createdAt')
                status = body.get('status', 'PENDENTE')

                cursor.execute(
                    '''INSERT INTO tasks (id, user_id, title, description, priority, status, deadline, created_at, completed_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (task_id, user_id, title.strip(), description.strip(), priority, status, deadline, created_at, body.get('completedAt'))
                )
                conn.commit()
                self.send_json(body, 201)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            finally:
                conn.close()
            return

        else:
            self.send_json({'error': 'Caminho não encontrado'}, 404)

    def do_PUT(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            body = json.loads(post_data) if post_data else {}
        except json.JSONDecodeError:
            self.send_json({'error': 'JSON inválido'}, 400)
            return

        match_task = re.match(r'^/api/tasks/([^/]+)$', self.path)
        if match_task:
            task_id = match_task.group(1)
            user_id = self.get_auth_user_id()
            if not user_id:
                self.send_json({'error': 'Não autorizado'}, 401)
                return

            conn = self.get_db()
            cursor = conn.cursor()
            try:
                cursor.execute('SELECT user_id FROM tasks WHERE id = ?', (task_id,))
                row = cursor.fetchone()
                if not row:
                    self.send_json({'error': 'Tarefa não encontrada'}, 404)
                    return
                if dict(row)['user_id'] != user_id:
                    self.send_json({'error': 'Acesso negado à tarefa'}, 403)
                    return

                fields_to_update = []
                values = []
                
                field_mapping = {
                    'title': 'title',
                    'description': 'description',
                    'priority': 'priority',
                    'status': 'status',
                    'deadline': 'deadline',
                    'completedAt': 'completed_at',
                }
                for js_key, sql_key in field_mapping.items():
                    if js_key in body:
                        fields_to_update.append(f"{sql_key} = ?")
                        values.append(body[js_key])

                if not fields_to_update:
                    self.send_json({'error': 'Nenhum campo para atualizar'}, 400)
                    return

                values.append(task_id)
                query = f"UPDATE tasks SET {', '.join(fields_to_update)} WHERE id = ?"
                
                cursor.execute(query, tuple(values))
                conn.commit()

                cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
                updated_row = cursor.fetchone()
                self.send_json(self.row_to_camel(updated_row), 200)

            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            finally:
                conn.close()
            return

        else:
            self.send_json({'error': 'Caminho não encontrado'}, 404)

    def do_DELETE(self):
        match_task = re.match(r'^/api/tasks/([^/]+)$', self.path)
        if match_task:
            task_id = match_task.group(1)
            user_id = self.get_auth_user_id()
            if not user_id:
                self.send_json({'error': 'Não autorizado'}, 401)
                return

            conn = self.get_db()
            cursor = conn.cursor()
            try:
                cursor.execute('SELECT user_id FROM tasks WHERE id = ?', (task_id,))
                row = cursor.fetchone()
                if not row:
                    self.send_json({'error': 'Tarefa não encontrada'}, 404)
                    return
                if dict(row)['user_id'] != user_id:
                    self.send_json({'error': 'Acesso negado à tarefa'}, 403)
                    return

                cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
                conn.commit()
                self.send_json({'success': True}, 200)

            except Exception as e:
                self.send_json({'error': str(e)}, 500)
            finally:
                conn.close()
            return

        else:
            self.send_json({'error': 'Caminho não encontrado'}, 404)

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

def run_server():
    init_db()
    server_address = ('', PORT)
    httpd = ThreadingHTTPServer(server_address, RequestHandler)
    print(f"Servidor backend rodando em http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor finalizado.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
