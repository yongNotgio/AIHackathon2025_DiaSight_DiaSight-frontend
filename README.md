# DiaSight – Quick Guide

## Website Use
1. Open [diasight.vercel.app](https://diasight.vercel.app)  
2. Log in with email & password  
3. Fill out assessments, view results, and use navigation buttons

---

## Local ML Predictions
**Requirements:** Python 3.8+, pip  

**Steps:**
```bash
# 1. Get the code
#    (Diasight-Deployment folder from your team/repo)

# 2. Go to folder
cd Diasight-Deployment

# 3. (Optional) Create virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run ML API
python main.py
Default URL: http://localhost:8000
