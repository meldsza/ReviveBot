module.exports = (channel,text) =>
{
	while(text.length>2000)
	{
		channel.sendMessage(text.substring(0,2000));
		text = text.substring(2000);
	}
	if(text.length>0)
		channel.sendMessage(text);
}