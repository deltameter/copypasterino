**Warning: this is the first substantial project I had ever done. As a result, I would not suggest looking at the code, for fear of your sanity :)**

# Copypasterino
A "copypasta" is a humourous block of text designed to be copy-pasted over and over again. A sort of Internet in-joke if you will.  Copypasterino was a user-submitted collection of these copypastas. Each submission would also be voted on by users, leading to an easy to access database of high quality copypastas. 

At its height, Copypasterino averaged an estimated 75,000+ unique monthly visitors.

##### My Personal Favourite Copypastas
Here are a couple of my favorite copypastas, and these are generally a good example of what copypastas actually are. 

>Sodium, atomic number 11, was first isolated by Peter Dager in 1807. A chemical component of salt, he named it Na in honor of the saltiest region on earth, North America.

> ☑ “This gentleman's deck is ABSURD!” ☑ “My deck cannot hope to prevail against a deck of that caliber” ☑ He REQUIRED those two cards in subsequent order to succeed" ☑ “He extracted from his deck the only cards capable of defeating me” ☑ "His cards defied logic" ☑ “There was no manoeuvre at my disposal to secure victory” ☑ “I played impeccably”
    
> Hey Forsen, I want to play control warrior but I'm missing: Grommash, Alexstrasza, Harrison, Sylvanas, Baron Geddon, Shield Slam, Brawl, Naxx, and the Hearthstone game. Can you suggest replacements?

### What I learned
- The basics of full stack development and generally how web applications work. 
- The basics of databases.
- Deploying an actual web application and all of the Linux skills and knowledge that requires.
- *Some* good practices such as regularly creating database backups. 
- NodeJS, jQuery, Bootstrap

### What I did wrong
- The app was not well organized. I had no clue what MVC was.
- Hard-coded things like admin credentials. 
- When I started, I had no clue how websites worked. I thought that all websites were Single Page Applications. Copypasterino was designed as such, but instead of responding to each request by querying the database for the requested copypastas, I returned cached .txt files of copypastas that were updated periodically. 

