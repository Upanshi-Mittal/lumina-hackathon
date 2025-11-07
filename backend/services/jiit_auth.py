import requests

def verify_jiit_credentials(roll, password):
    LOGIN_URL = "https://webkiosk.jiit.ac.in/StudentFiles/StudentPage.jsp"  # replace if you have exact endpoint
    s = requests.Session()
    payload = {"x": roll, "y": password}
    r = s.post(LOGIN_URL, data=payload, allow_redirects=True, timeout=10)
    # simple heuristics (adjust for the specific portal):
    if r.status_code == 200 and ("dashboard" in r.text.lower() or "student" in r.url.lower()):
        return True
    return False
