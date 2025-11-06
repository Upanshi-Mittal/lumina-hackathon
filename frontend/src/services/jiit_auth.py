import requests

def verify_jiit_credentials(roll, password):

    LOGIN_URL = "https://webkiosk.jiit.ac.in/CommonFiles/UserActionn.jsp"  # example portal

    payload = {
        "x" : roll,
        "y" : password,
        "txtInst" : "JIIT",
    }

    session = requests.Session()
    response = session.post(LOGIN_URL, data=payload)

    # ✅ SUCCESS CONDITION
    if "Student Dashboard" in response.text or "Welcome" in response.text:
        return True
    
    # ❌ INVALID CREDENTIALS
    return False
