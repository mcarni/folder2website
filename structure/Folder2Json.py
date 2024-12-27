import os
import sys

folder = os.popen("stat "+sys.argv[1]).readlines()[5][8:-17]
try :
	jsonfi = os.popen("stat "+sys.argv[2]).readlines()[5][8:-17]
except :
	jsonfi = "null"

print(f"Last folder update : {folder}")
print(f"Last json file update : {jsonfi}")

def ReadPath(path, depth) :
	files = os.popen(f"ls -h {path}").readlines()

	files = [x[:-1] for x in files if x != "Folder2Json.py\n" and x != sys.argv[1]+".json\n" ]

	if "home" in files :
		files.pop(files.index("home"))
		files.insert(0,"home")

	for i in files :
		spaces = ""
		indent = ""
		for k in range(depth) :
			spaces += "	"
			indent += " "
		if not("." in i) :
			print(f"{indent}Packing {path}/{i}")
			name = i
			if name == "home" :
				name = "/"
			write.write(spaces+'"'+name+'" : {\n')
			ReadPath(f"{path}/{i}",depth+1)
			write.write(spaces+"},\n")
		else :
			print(f"{indent}{i}")
			name = i[:i.find(".")]
			file = path+"/"+i
			write.write(f'{spaces}"{name}" : "{open(file).read()[:-1]}",\n')

if max(folder,jsonfi) == folder or jsonfi == "null" :

	try :
		write = open(sys.argv[2],"x")
	except FileExistsError :
		write = open(sys.argv[2],"w")
	except :
		print("Something went wrong!")
		exit()

	write.write('"'+sys.argv[1]+'" : {\n')
	print("Packing "+sys.argv[1])
	ReadPath(sys.argv[1],1)
	write.write("}")
else :
	print("Json file up to date, doing nothing.")
