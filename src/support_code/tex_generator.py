'''
This script create LeTex file with default settings.
Put this script to where the folder of pictures are located and execut, then copy the output.
'''
from os import walk, getcwd, system
from pycnnum import num2cn
system('cls')

'''File Parameter'''
# Need to be changed
week_num = 8
ex_title = [
    'Create a chat room HTML.',
    'Connect with the websocket server.',
    'Submit a message to websocket server.',
    'Broadcast to the connected clients.',
    'Add input for user\'s name. Show time, name, and message.',
]
# Automatically generated
week_cn = num2cn(week_num, numbering_type="high",
                 alt_two=True, capitalize=False, traditional=True)

'''Tex Commands'''
tex_import = [
    '\documentclass[a4paper,12pt]{report}',
    '\\usepackage{geometry}',
    '\geometry{',
    'textheight = 750pt,',
    'textwidth = 500pt,',
    '}',
    '\\usepackage{graphicx}',
    '\graphicspath{{D:/Note_Database/Subject/IoTP Internet of Things Practice/w{0}/}}'.format(
        week_num),
    '\\usepackage{subfigure}',
    '\\usepackage{amsmath}',
    '\\usepackage{float}',
    '\\usepackage{hyperref}',
    '\\usepackage{CJKutf8}',
    '\\usepackage{listings}',
    '\\usepackage[usenames,dvipsnames]{color}',
    '\\usepackage{textcomp}'
    '',
    '\lstdefinelanguage[ECMAScript2015]{JavaScript}[]{JavaScript}{',
    '  morekeywords=[1]{await, async, case, catch, class, const, default, do,',
    '    enum, export, extends, finally, from, implements, import, instanceof,',
    '    let, static, super, switch, throw, try},',
    '  morestring=[b]` % Interpolation strings.',
    '}',
    '',
    '\lstdefinelanguage{JavaScript}{',
    '  morekeywords=[1]{break, continue, delete, else, for, function, if, in,',
    '    new, return, this, typeof, var, void, while, with},',
    '  morekeywords=[2]{false, null, true, boolean, number, undefined,',
    '    Array, Boolean, Date, Math, Number, String, Object},',
    '  morekeywords=[3]{eval, parseInt, parseFloat, escape, unescape},',
    '  sensitive,',
    '  morecomment=[s]{/*}{*/},',
    '  morecomment=[l]//,',
    '  morecomment=[s]{/**}{*/}, % JavaDoc style comments',
    '  morestring=[b]\',',
    '  morestring=[b]\"',
    '}[keywords, comments, strings]',
    '\lstalias[]{ES6}[ECMAScript2015]{JavaScript}',
    '\definecolor{mediumgray}{rgb}{0.3, 0.4, 0.4}',
    '\definecolor{mediumblue}{rgb}{0.0, 0.0, 0.8}',
    '\definecolor{forestgreen}{rgb}{0.13, 0.55, 0.13}',
    '\definecolor{darkviolet}{rgb}{0.58, 0.0, 0.83}',
    '\definecolor{royalblue}{rgb}{0.25, 0.41, 0.88}',
    '\definecolor{crimson}{rgb}{0.86, 0.8, 0.24}',
    '\lstdefinestyle{JSES6Base}{',
    '  backgroundcolor=\color{white},',
    '  basicstyle=\\ttfamily,',
    '  breakatwhitespace=false,',
    '  breaklines=true`\',',
    '  columns=fullflexible,',
    '  commentstyle=\color{mediumgray}\\upshape,',
    '  emph={},',
    '  emphstyle=\color{crimson},',
    '  extendedchars=true,  % requires inputenc',
    '  fontadjust=true,',
    '  frame=single,',
    '  identifierstyle=\color{black},',
    '  keepspaces=true,',
    '  keywordstyle=\color{mediumblue},',
    '  keywordstyle={[2]\color{darkviolet}},',
    '  keywordstyle={[3]\color{royalblue}},',
    '  numbers=left,',
    '  numbersep=5pt,',
    '  numberstyle=\\tiny\color{black},',
    '  rulecolor=\color{black},',
    '  showlines=true,',
    '  showspaces=false,'
    '  showstringspaces=false,',
    '  showtabs=false,'
    '  stringstyle=\color{forestgreen},',
    '  tabsize=2,',
    '  upquote=true  % requires textcomp',
    '}',
    '\lstdefinestyle{JavaScript}{',
    '  language=JavaScript,',
    '  style=JSES6Base',
    '}',
    '\lstdefinestyle{ES6}{',
    '  language=ES6,'
    '  style=JSES6Base'
    '}'
    '\lstdefinestyle{json}{'
    '  backgroundcolor=\color{white},',
    '  basicstyle=\\ttfamily,',
    '  breakatwhitespace=false,',
    '  breaklines=true`\',',
    '  columns=fullflexible,',
    '  comment=[l]{:},',
    '  commentstyle=\color{mediumgray}\\upshape,',
    '  emph={},',
    '  emphstyle=\color{crimson},',
    '  extendedchars=true,  % requires inputenc',
    '  fontadjust=true,',
    '  frame=single,',
    '  identifierstyle=\color{black},',
    '  keepspaces=true,',
    '  numbers=left,',
    '  numbersep=5pt,',
    '  numberstyle=\\tiny\color{black},',
    '  rulecolor=\color{black},',
    '  showlines=true,',
    '  showspaces=false,',
    '  showstringspaces=false,',
    '  showtabs=false,',
    '  string=[s]{"}{"},',
    '  stringstyle=\color{royalblue},',
    '  tabsize=2,',
    '  upquote=true  % requires textcomp',
    '}',
    '',
]
tex_start = [
    '\\begin{document}',
    '\\begin{CJK*}{UTF8}{bsmi}',
    '\sffamily',
    '',
    '\\title{{物聯網實務 第{0}周作業}}'.format(week_cn),
    '\\author{電機四乙 10828241 陳大荃}',
    '\date{\\today}',
    '',
]
tex_end = [
    '\end{CJK*}',
    '\end{document}',
]

try:
    # get file list
    f = []
    for (dirpath, dirnames, filenames) in walk(getcwd()):
        f.extend(filenames)
        break

    # get max exercise number
    ex_num = 0
    for filename in f:
        if filename.endswith('.png'):
            temp = int(filename[4:5])
            if temp > ex_num:
                ex_num = temp

    # get subfigure command
    tex_subfigure = []
    for filename in f:
        if filename.endswith('.png'):
            subtitle = filename[6:-4].replace('_', ' ')
            if ('flow' or 'dashboard' or 'context' or 'debug' or 'website' or 'webpage') in filename:
                tex_subfigure.append('\\subfigure[{0}]{{\\includegraphics[scale=0.35]{{{1}}}}}'.format(
                    subtitle, filename))
            else:
                tex_subfigure.append('\\subfigure[node: {0}]{{\\includegraphics[scale=0.35]{{{1}}}}}'.format(
                    subtitle, filename))

    # get exercise command
    tex_ex = []
    for i in range(1, ex_num+1):
        tex_ex_start = [
            '\maketitle',
            '\\textbf{{Exercise {0}-{1} {2}}}'.format(
                week_num, i, ex_title[i-1]),
            '\\begin{figure}[H]',
            '\centering',
        ]
        tex_ex += tex_ex_start
        # get subfigure command % not finished yet
        for j in range(len(tex_subfigure)):
            if int(filenames[j][4:5]) == i:
                tex_ex.append(tex_subfigure[j])
        tex_ex_end = [
            '\caption{{\\normalsize Exercise {0}-{1}.}}'.format(week_num, i),
            '\end{figure}',
            '',
        ]
        tex_ex += tex_ex_end

    '''Write to file'''
    tex_cmd = []
    tex_cmd += tex_import
    tex_cmd += tex_start
    tex_cmd += tex_ex
    tex_cmd += tex_end
    with open('w{0}_10828241.tex'.format(week_num), 'w', encoding='utf-8') as f:
        for line in tex_cmd:
            f.write(line + '\n')
    print('[tex_generator.py] >> Commands:\n')
    [print(line) for line in tex_cmd]
    print('\n[tex_generator.py] >> File {0} created.\n'.format(
        'w{0}_10828241.tex'.format(week_num)))
except:
    print('[tex_generator.py] >> Error: Parameter conflict.')
    print('[tex_generator.py] >> Please check the parameters.')
