import time
from datetime import datetime
from pynput.keyboard import Controller, Key
import webbrowser
from temp_data import lst

def run_automation():
    keyboard = Controller()
    is_started = False

    try:
        for meeting in lst:
            while True:
                if not is_started:
                    current_time = datetime.now()
                    start_hour, start_minute = map(int, meeting[1].split(':'))
                    
                    if current_time.hour == start_hour and current_time.minute == start_minute:
                        webbrowser.open(meeting[0])
                        is_started = True
                else:
                    current_time = datetime.now()
                    end_hour, end_minute = map(int, meeting[2].split(':'))
                    
                    if current_time.hour == end_hour and current_time.minute == end_minute:
                        keyboard.press('w')
                        time.sleep(1)
                        keyboard.press(Key.enter)
                        is_started = False
                        break
                
                time.sleep(5)
    except KeyboardInterrupt:
        print("Automation stopped")

if __name__ == "__main__":
    run_automation()