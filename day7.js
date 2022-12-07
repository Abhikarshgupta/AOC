/**
 * step 1:- read in the input
 * step 2:- at each $, it can be two things, either cd, or ls
 * step 3:- if it is cd, it can be 3 things, cd / -> root, cd .. ->out 1 dir, cd x -> in 1 dir
 * step 4:- if it is ls, we start adding onto the tree. an object( name and size.)
 * step 5:- once the whole list is parsed, start adding the sizes and appending to the dirs.
 * step 6:- if dir A = 50k, dir B = 60k, and dir C = dir A + dir B, dir C not to be considered.
 * data structure:-
 * const x = {
	type: "folder",
	name: "/",
    items:[
        {
            type: 'folder',
            name: 'folder1',
            parent: '/',
        },
        {
            type: 'file',
            name: 'fileName',
            parent:'folder1',
            size: 999,
        },
    ]
};
 */

const fs = require("fs");
fs.readFile("testInputDay7.txt", "utf-8", function (err, data) {
	if (err) {
		console.log(err);
	}
	const fileDirectory = { type: "folder", name: "/", items: [] };
	const inputCommands = data.split("\n");
	inputCommands.shift();
	let activeDirectory = "/";
	let show = true;
	const folderMap = new Map();
	folderMap.set("/", 0);
	const parseCommand = (command) => {
		const words = command.split(" ");
		if (show) {
			if (words[0] === "$") {
				if (words[1] === "cd") {
					if (words[2] === "..") {
						if (activeDirectory !== "/") {
							activeDirectory = fileDirectory.items.find(
								(item) => item.name === activeDirectory
							).parent;
						}
					} else if (words[2] === "/") {
						activeDirectory = "/";
					} else {
						activeDirectory = String(words[2]);
					}
				}
			} else if (words[0] === "dir") {
				fileDirectory.items.push({
					type: "folder",
					size: 0,
					name: words[1],
					parent: activeDirectory,
				});
				if (activeDirectory !== "/") {
					const parentFolder = fileDirectory.items.find(
						(item) => item.name === activeDirectory
					);
					// console.log({ parentFolder });
					if (!parentFolder["children"]) {
						parentFolder["children"] = [words[1]];
					} else {
						parentFolder["children"].push(words[1]);
					}
				}
				folderMap.set(words[1], 0);
			} else {
				fileDirectory.items.push({
					type: "file",
					size: Number(words[0]),
					name: words[1],
					parent: activeDirectory,
				});
				folderMap.set(
					activeDirectory,
					folderMap.get(activeDirectory) + Number(words[0])
				);
			}
		}
	};
	inputCommands.forEach((command) => {
		// step 1, parse the commands and add each folder to a map.
		parseCommand(command);
	});
	let totalSum = 0;
	// add folder sizes of <= limit
	for (const [key, value] of folderMap.entries()) {
		totalSum += value <= 100000 && value;
	}
	// traverse the folders, and if the children folders' sum <= limit, add them too.
	fileDirectory.items.forEach((item) => {
		if (item.type === "folder") {
			if (item.children?.length > 0) {
				let currSum = 0;
				console.log({ item });
				item.children.forEach((childFolder) => {
					currSum += folderMap.get(childFolder);
				});
				console.log({ currSum });
				if (currSum + folderMap.get(item.name) <= 100000) totalSum += currSum;
			}
		}
	});
	console.log(totalSum);
});
