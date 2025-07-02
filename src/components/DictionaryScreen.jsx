import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckSquare,
  Square
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';

const DictionaryScreen = () => {
  const {
    dictionary,
    excludedWords,
    addWord,
    excludeWord,
    includeWord,
    getWordProgress,
    importDictionary,
    exportDictionary
  } = useAppStore();

  const [newWord, setNewWord] = useState({
    word: '',
    correctIndex: 0,
    wrongIndex: 0
  });
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [showExcluded, setShowExcluded] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const getVowelPositions = (word) => {
    const vowels = 'аеёиоуыэюя';
    const positions = [];
    for (let i = 0; i < word.length; i++) {
      if (vowels.includes(word[i].toLowerCase())) {
        positions.push(i);
      }
    }
    return positions;
  };

  const handleAddWord = () => {
    if (!newWord.word.trim()) return;
    
    const vowelPositions = getVowelPositions(newWord.word);
    if (vowelPositions.length < 2) {
      alert('Слово должно содержать минимум 2 гласные буквы');
      return;
    }

    if (newWord.correctIndex >= vowelPositions.length || newWord.wrongIndex >= vowelPositions.length) {
      alert('Индексы ударений не могут быть больше количества гласных в слове');
      return;
    }

    addWord(newWord);
    setNewWord({ word: '', correctIndex: 0, wrongIndex: 0 });
  };

  const handleExcludeSelected = () => {
    selectedWords.forEach(word => excludeWord(word));
    setSelectedWords(new Set());
  };

  const handleIncludeSelected = () => {
    selectedWords.forEach(word => includeWord(word));
    setSelectedWords(new Set());
  };

  const handleSelectAll = () => {
    const visibleWords = showExcluded 
      ? dictionary.filter(w => excludedWords.includes(w.word))
      : dictionary.filter(w => !excludedWords.includes(w.word));
    
    if (selectedWords.size === visibleWords.length) {
      setSelectedWords(new Set());
    } else {
      setSelectedWords(new Set(visibleWords.map(w => w.word)));
    }
  };

  const handleExport = () => {
    const data = exportDictionary();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dictionary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (data.слова && Array.isArray(data.слова)) {
        importDictionary(data.слова);
        setImportText('');
        setShowImport(false);
        alert('Словарь успешно импортирован!');
      } else {
        alert('Неверный формат файла');
      }
    } catch (error) {
      alert('Ошибка при импорте: ' + error.message);
    }
  };

  const visibleWords = showExcluded 
    ? dictionary.filter(w => excludedWords.includes(w.word))
    : dictionary.filter(w => !excludedWords.includes(w.word));

  const allSelected = selectedWords.size === visibleWords.length && visibleWords.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Управление словарём
        </h1>

        {/* Add new word */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Добавить новое слово
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="word">Слово</Label>
                <Input
                  id="word"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  placeholder="Введите слово"
                />
              </div>
              <div>
                <Label htmlFor="correct">Правильное ударение (индекс гласной)</Label>
                <Input
                  id="correct"
                  type="number"
                  min="0"
                  value={newWord.correctIndex}
                  onChange={(e) => setNewWord({ ...newWord, correctIndex: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="wrong">Неправильное ударение (индекс гласной)</Label>
                <Input
                  id="wrong"
                  type="number"
                  min="0"
                  value={newWord.wrongIndex}
                  onChange={(e) => setNewWord({ ...newWord, wrongIndex: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            {newWord.word && (
              <div className="text-sm text-muted-foreground">
                Гласные в слове "{newWord.word}": {getVowelPositions(newWord.word).map((pos, idx) => 
                  `${idx}: ${newWord.word[pos]}`
                ).join(', ')}
              </div>
            )}
            <Button onClick={handleAddWord} disabled={!newWord.word.trim()}>
              Добавить слово
            </Button>
          </CardContent>
        </Card>

        {/* Import/Export */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Импорт/Экспорт</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Экспорт словаря
              </Button>
              <Button variant="outline" onClick={() => setShowImport(!showImport)}>
                <Upload className="w-4 h-4 mr-2" />
                Импорт словаря
              </Button>
            </div>
            
            {showImport && (
              <div className="space-y-2">
                <Label htmlFor="import">Вставьте JSON словаря:</Label>
                <Textarea
                  id="import"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='{"слова": [{"word": "пример", "correctIndex": 0, "wrongIndex": 1}]}'
                  rows={4}
                />
                <Button onClick={handleImport} disabled={!importText.trim()}>
                  Импортировать
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Word list */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Словарь ({visibleWords.length} слов)</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExcluded(!showExcluded)}
                >
                  {showExcluded ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {showExcluded ? 'Показать активные' : 'Показать исключённые'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visibleWords.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {allSelected ? <Square className="w-4 h-4 mr-2" /> : <CheckSquare className="w-4 h-4 mr-2" />}
                  {allSelected ? 'Снять выделение' : 'Выбрать все'}
                </Button>
                
                {selectedWords.size > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Выбрано: {selectedWords.size}
                    </span>
                    {showExcluded ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleIncludeSelected}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Включить выбранные
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExcludeSelected}
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Исключить выбранные
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="space-y-2">
              {visibleWords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {showExcluded ? 'Нет исключённых слов' : 'Словарь пуст'}
                </p>
              ) : (
                visibleWords.map((word) => {
                  const progress = getWordProgress(word.word);
                  const isSelected = selectedWords.has(word.word);
                  
                  return (
                    <div
                      key={word.word}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedWords);
                            if (checked) {
                              newSelected.add(word.word);
                            } else {
                              newSelected.delete(word.word);
                            }
                            setSelectedWords(newSelected);
                          }}
                        />
                        <div>
                          <span className="font-medium">{word.word}</span>
                          <div className="text-sm text-muted-foreground">
                            Правильное: {word.correctIndex}, Неправильное: {word.wrongIndex}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {progress > 0 && (
                          <Badge variant={progress === 100 ? "default" : "secondary"}>
                            {progress}%
                          </Badge>
                        )}
                        {showExcluded ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => includeWord(word.word)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => excludeWord(word.word)}
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DictionaryScreen;

