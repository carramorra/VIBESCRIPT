import os
from flask import Flask, send_from_directory, render_template_string

app = Flask(__name__)

# The directory containing your index.html and index.tsx
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    # Read the API key from the environment
    api_key = os.environ.get('API_KEY', '')
    
    # Read index.html
    with open(os.path.join(ROOT_DIR, 'index.html'), 'r') as f:
        html_content = f.read()
    
    # Inject the API_KEY into the browser's global process object
    # This keeps your existing geminiService.ts code working without changes
    env_script = f"<script>window.process = {{ env: {{ API_KEY: '{api_key}' }} }};</script>"
    
    # Insert the env script before the closing </head>
    html_content = html_content.replace('</head>', f'{env_script}\n</head>')
    
    return html_content

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(ROOT_DIR, path)

if __name__ == '__main__':
    print("🚀 Mood → Text Rewriter running at http://localhost:5000")
    print("💡 Make sure to set your API_KEY environment variable!")
    # For local development, use debug=True for auto-reload
    app.run(port=5000, debug=True)
