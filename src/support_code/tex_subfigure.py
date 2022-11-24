'''
This script print out LeTex command for subfigures.
Put this script to where the folder of pictures are located and execut, then copy the output.
'''

from os import walk, getcwd, system

system('cls')
f = []
for (dirpath, dirnames, filenames) in walk(getcwd()):
    f.extend(filenames)
    break
for filename in f:
    if filename.endswith('.png'):
        subtitle = filename[6:-4].replace('_', ' ')
        if ('flow' or 'dashboard' or 'context' or 'debug') in filename:
            cmd = '\\subfigure[{0}]{{\\includegraphics[scale=0.35]{{{1}}}}}'.format(
                subtitle, filename)
        else:
            cmd = '\\subfigure[node: {0}]{{\\includegraphics[scale=0.35]{{{1}}}}}'.format(
                subtitle, filename)
        print(cmd)
print()
# \subfigure[Node-RED Flow]{\includegraphics[scale=0.35]{ex6-4_flow.png}}
