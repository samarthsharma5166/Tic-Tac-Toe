import Image from "next/image";
import {Card,CardContent} from '../components/ui/card'
import { Button} from '../components/ui/button'
import { X, Circle, Users, Award } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="container mx-auto pt-10 px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <X className="h-8 w-8 text-blue-500" />
            <Circle className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold">TicTacToe Multiplayer</h1>
          </div>
          <div className="hidden md:flex gap-4">
            <Button variant="ghost">How to Play</Button>
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">About</Button>
          </div>
          <Link href="/game/room" className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded">Play Now</Link>
        </div>
      </header>

      {/* Main Hero */}
      <section className="container mx-auto px-4 md:px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-blue-500">Play</span> Tic Tac Toe
            <span className="text-pink-500"> Online</span> with Friends!
          </h2>
          <p className="text-xl text-gray-300">
            Challenge your friends, improve your strategy, and become the ultimate Tic Tac Toe champion.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/game/room" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded ">
              Start Playing Now
            </Link>
            <Button size="lg" variant="outline" className="text-gray-900" >
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-800 rounded-lg border-2 border-gray-700 flex items-center justify-center text-5xl font-bold"
              >
                {index % 3 === 0 && <X className="h-12 w-12 text-blue-500" />}
                {index % 3 === 1 && <Circle className="h-12 w-12 text-pink-500" />}
              </div>
            ))}
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Game Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Multiplayer Matches</h3>
              <p className="text-gray-300">Play with friends online in real-time multiplayer matches.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Leaderboards</h3>
              <p className="text-gray-300">Compete for the top spot on our global leaderboards.</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Circle className="h-12 w-12 text-purple-500 mb-4 " />
              <h3 className="text-xl font-bold mb-2 text-white">Custom Game Modes</h3>
              <p className="text-gray-300">Enjoy various game modes with different rules and board sizes.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Play */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How to Play</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Create a Game</h3>
              <p className="text-gray-300">Start a new game and invite your friends to join.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Make Your Move</h3>
              <p className="text-gray-300">Take turns placing your X or O on the board.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Win the Game</h3>
              <p className="text-gray-300">Get three in a row horizontally, vertically, or diagonally to win!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of players around the world and start your Tic Tac Toe journey today!</p>
          <Link href="/game/room"  className="bg-white text-blue-800 hover:bg-gray-100 px-6 py-3 rounded-md">Play Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <X className="h-6 w-6 text-blue-500" />
              <Circle className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold">TicTacToe Multiplayer</span>
            </div>
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href={"#"} className="text-gray-300 hover:text-white">About</Link>
              <Link href={"#"} className="text-gray-300 hover:text-white">Features</Link>
              <Link href={"#"} className="text-gray-300 hover:text-white">Contact</Link>
              <Link href={"#"} className="text-gray-300 hover:text-white">Privacy</Link>
            </div>
            <div className="text-gray-400">
              © 2023 TicTacToe Multiplayer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
