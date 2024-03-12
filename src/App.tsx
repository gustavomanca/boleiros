import { ChangeEvent, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function App() {
  const [playersText, setPlayersText] = useState('')
  const [teams, setTeams] = useState<string[][]>([])

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPlayersText(event.target.value)
  }

  const generateTeams = () => {
    const players = playersText
      .split('\n')
      .map((player) => player.trim())
      .filter(Boolean)
    const shuffledPlayers = shuffleArray(players)
    const numTeams = Math.ceil(shuffledPlayers.length / 5)
    const teamsArray = []

    for (let i = 0; i < numTeams; i++) {
      const team = shuffledPlayers.slice(i * 5, (i + 1) * 5)
      teamsArray.push(team)
    }

    setTeams(teamsArray)
  }

  const reset = () => {
    setPlayersText('')
    setTeams([])
  }

  return (
    <div className="flex items-center flex-col gap-8 w-screen p-8">
      <h1>Boleiros</h1>
      {!teams.length && (
        <Textarea
          className="bg-zinc-950"
          placeholder="Cole a lista de jogadores aqui..."
          value={playersText}
          onChange={handleInputChange}
          rows={10}
          cols={30}
        />
      )}
      <div className="flex gap-8 mb-4">
        <Button onClick={generateTeams}>Sortear</Button>
        {Boolean(teams.length) && (
          <Button onClick={reset} variant="destructive">
            Resetar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-10">
        {teams.map((team, index) => (
          <div key={index}>
            <h3 className="mb-6">Time {index + 1}</h3>
            <ul>
              {team.map((player, i) => (
                <li key={i} className="mb-2">
                  {player}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
