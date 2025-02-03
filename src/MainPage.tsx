import { ChangeEvent, useState } from 'react'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { useToast } from './components/ui/use-toast'
import { shuffleArray } from './utils/shuffle'
import { Label } from './components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select'

function MainPage() {
  const { toast } = useToast()

  const [playersPerTeam, setPlayersPerTeam] = useState(5)
  const [playersText, setPlayersText] = useState('')
  const [teams, setTeams] = useState<string[][]>([])

  const copy = () => {
    const text = teams.reduce((acc, value, index) => {
      const teamLabel = `${index === 0 ? '' : '\n\n'}*Time ${String(
        index + 1
      )}*`
      return acc + teamLabel.concat('\n\n', value.join('\n'))
    }, '')

    navigator.clipboard.writeText(text)
    toast({
      className: 'bg-gray-900 p-4',
      title: 'Times copiados!',
      duration: 2500
    })
  }

  const clearEmptyPlayers = (players: Array<string>) => {
    return players
      .map((player) => {
        const cleared = player.replace(/\d+/g, '').replace('-', '').trim()
        return cleared
      })
      .filter((value) => value !== '')
  }

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPlayersText(event.target.value)
  }

  const handlePlayersPerTeamChange = (value: string) => {
    setPlayersPerTeam(Number.parseInt(value, 10))
  }

  const sanitizeHeaders = () => {
    const updated = playersText.split('1-')
    updated.shift()
    return updated.join('\n')
  }

  const generateTeams = () => {
    const sanitized = sanitizeHeaders()
    const players = clearEmptyPlayers(sanitized.split('\n'))
    const shuffledPlayers = shuffleArray(players)
    const numTeams = Math.ceil(shuffledPlayers.length / playersPerTeam)
    const teamsArray = []

    for (let i = 0; i < numTeams; i++) {
      const team = shuffledPlayers.slice(
        i * playersPerTeam,
        (i + 1) * playersPerTeam
      )
      teamsArray.push(team)
    }

    setTeams(teamsArray)
  }

  const reset = () => {
    setPlayersText('')
    setTeams([])
  }

  return (
    <div className="container flex items-center flex-col gap-8 w-screen p-4">
      <h1 className="text-4xl">Boleiros</h1>

      <div className="flex items-center gap-4">
        <Label htmlFor="playersPerTeam">Jogadores por Time:</Label>
        <Select onValueChange={handlePlayersPerTeamChange} defaultValue="5">
          <SelectTrigger className="w-[180px] bg-transparent border-zinc-800">
            <SelectValue placeholder="Selecione o número de jogadores" />
          </SelectTrigger>
          <SelectContent className="bg-black/50 backdrop-blur-sm border-zinc-800">
            <SelectItem value="4">4 jogadores</SelectItem>
            <SelectItem value="5">5 jogadores</SelectItem>
            <SelectItem value="6">6 jogadores</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
      <div className="flex gap-8">
        <Button onClick={generateTeams}>Sortear</Button>
        {Boolean(teams.length) && (
          <Button onClick={reset} variant="destructive">
            Resetar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {teams.map((team, index) => (
          <div key={index} className="bg-gray-900 p-4">
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

      {Boolean(teams.length) && <Button onClick={copy}>Copiar</Button>}
    </div>
  )
}

export default MainPage
