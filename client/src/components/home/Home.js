import React, { useState, useEffect } from 'react';
import './home.css';
import Postlist from '../postlist/Postlist';

export default function Home() {
    const quotes = [
        { quote: "What you do after you create your content is what truly counts.", author: "Gary Vaynerchuk" },
        { quote: "Don’t focus on having a great blog. Focus on producing a blog that’s great for your readers.", author: "Brian Clark" },
        { quote: "Success is the ability to go from failure to failure without losing your enthusiasm.", author: "Winston Churchill" },
        { quote: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki" },
        { quote: "Blogging is to writing what extreme sports are to athletics: more free-form, more accident-prone, less formal, more alive. It is, in many ways, writing out loud.", author: "Andrew Sullivan" },
        { quote: "Don’t try to plan everything out to the very last detail. I’m a big believer in just getting it out there: create a minimal viable product or website, launch it, and get feedback.", author: "Neil Patel" },
        { quote: "If you are going through hell, keep going.", author: "Winston Churchill" },
        { quote: "Customers can’t always tell you what they want, but they can always tell you what’s wrong.", author: "Carly Fiorina" },
        { quote: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
        { quote: "Don’t find customers for your products, find products for your customers.", author: "Seth Godin" },
        { quote: "If you can’t explain it simply, you don’t understand it well enough.", author: "Albert Einstein" },
        { quote: "Entrepreneurs are willing to work 80 hours a week to avoid working 40 hours per week.", author: "Lori Greiner" },
        { quote: "When you brand yourself properly, the competition becomes irrelevant.", author: "Dan Schawbel" },
        { quote: "The first thing you need to decide when you build your blog is what you want to accomplish with it, and what it can do if successful.", author: "Ron Dawson" },
        { quote: "I think I am about 5 for 500 when it comes to successful ideas vs flops.", author: "Jerry Schoemaker" },
        { quote: "Blogging is hard because of the grind required to stay interesting and relevant.", author: "Sufia Tippu" },
        { quote: "There’s a lot of information out there for free, so you’ve got to figure out what makes your information different.", author: "Matt Wolfe" },
        { quote: "I’ve long advised that bloggers seeking to make money from blogging spread their interests across multiple revenue streams so as not to put all their eggs in one basket.", author: "Darren Rowse" },
        { quote: "I made a decision to write for my readers, not to try to find more readers for my writing.", author: "Seth Godin" },
        { quote: "The key is, no matter what story you tell, make your buyer the hero.", author: "Chris Brogan" },
        { quote: "Transparency, honesty, kindness, good stewardship, even humor, work in business at all times.", author: "John Gerzema" },
        { quote: "It can be pretty rough out there for bloggers who think small. You’ve got to think – and play – big if you want to make a larger footprint these days.", author: "David Risley" },
        { quote: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
        { quote: "If you think monetizing your site is wonderful, fine. If you think it’s evil, fine. But make up your mind before you seriously consider starting down this path. If you want to succeed, you must be congruent.", author: "Steve Pavlina" },
        { quote: "I’m convinced that about half of what separates the successful entrepreneurs from the non-successful ones is pure perseverance.", author: "Steve Jobs" },
        { quote: "Dreaming, after all, is a form of planning.", author: "Gloria Steinem" },
    ]
    

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [quotes.length]);

    return (
        <>
            <div className='header'>
                <div className="headerTitles">
                    <span className='headerTitleSm'>Kipkoech</span>
                    <span className='headerTitleLg'>Blog App</span>
                </div>
                <img className='headerImg' src='https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='' />
            </div>
            <div className='quoteSlideshow'>
                <p className='quoteText'>{quotes[currentQuoteIndex].quote}</p>
                <p className='quoteAuthor'>{quotes[currentQuoteIndex].author}</p>
            </div>
            <div>
                <Postlist />
            </div>
        </>
    );
}
