
from pygaze import libscreen
from pygaze import libtime
from pygaze import libinput
from pygaze import eyetracker
import time
import json
import easygui

def get_circles(screen, colour, pos):
    screen.draw_circle(colour=colour, pos=pos, r=10, fill=True),

name = easygui.enterbox("Name: ")

my_keyboard = libinput.Keyboard(timeout= 0)
my_mouse = libinput.Mouse()
# start timing
libtime.expstart()

# create display object
disp = libscreen.Display()
screen = libscreen.Screen()
# create eyetracker object
tracker = eyetracker.EyeTracker(disp)
circles = [
    ((0,255,0),(38.390625, 70)),
    ((0,255,0),(960, 70)),
    ((0,255,0), (1861.609375, 70)),
    ((0,255,0),(38.390625, 540)),
    ((0,255,0), (960, 540)),
    ((0,255,0), (1861.609375, 540)),
    ((0,255,0),(38.390625, 1004.609375)),
    ((0,255,0), (960, 1004.609375)),
    ((0,255,0), (1861.609375, 1004.609375))
]




tracker.calibrate()
points = 0

eyeData = []
while points < 10:
    print(points)
    screen.clear()
    for circle in circles:
        get_circles(screen, circle[0], circle[1])
    disp.fill(screen)
    disp.show()
    if (points == 9):
        break
    my_mouse.get_clicked()
    tracker.start_recording()
    t_end = time.time() + 5
    gazeData = []
    while time.time() < t_end:
        gaze = tracker.sample()
        gazeData.append({"x": gaze[0], "y": gaze[1]})
        time.sleep(30/1000)
    eyeData.append(gazeData)
    temp = list(circles[points])
    temp[0] = (255,0,0)
    circles[points] = tuple(temp)
    points += 1

screen.clear()
data = []
index = 0
for circle in circles:
    data.append({"position": {"x": circle[1][0], "y": circle[1][1]}, "eyetracker": "PyGaze", "data": eyeData[index] })
    index += 1
# Serializing json
json_object = json.dumps(data, indent=4)
 
# Writing to sample.json
file = "PyGaze_" + name + ".json"
with open(file, "w") as outfile:
    outfile.write(json_object)