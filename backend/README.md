
Creating and activating a virtual environment is essential for isolating Python dependencies in your projects. 

### Creating and Activating a Virtual Environment

#### Using `venv` (built-in to Python 3):

1. **Navigate to Your Project Directory:**
   ```bash
   cd text-chat-analysis\backend\
   ```

2. **Create a Virtual Environment:**
   ```bash
   python3 -m venv env
   ```
   This command creates a virtual environment named `env` in your project directory.

3. **Activate the Virtual Environment:**

   - **On Windows:**
     ```bash
     .\env\Scripts\activate
     ```

   - **On macOS and Linux:**
     ```bash
     source env/bin/activate
     ```
     
4. **Install necessary libraries using requirements.txt**
   ```bash
   pip install -r requirements.txt
     ```

5. **Run the app**
     ```bash
   python app.py
     ```
**Make sure that it is running in one of the terminal and frontend on the other terminal**
   Once activated, your terminal prompt will change to indicate you are now working inside the virtual environment.


#### Deactivating the Virtual Environment:

To deactivate the virtual environment and return to your global Python environment, simply run:
```bash
deactivate
```
