pragma solidity ^0.4.24;

contract MyFlag {

	struct Topic {
		string title;
		string content;
		address owner;
		uint ts;
	}

	Topic[] public topics;

	function postTopic(string title, string content) public {
		topics.push(Topic(title, content, msg.sender, now));
	}

	function getCount() public view returns(uint) {
		return topics.length;
	}
}
