import { useQuery } from "@tanstack/react-query";
import { fetchleaderboardEntries } from "../backend/db";
import { formatMinutes } from "../utils/formatDate";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Clock, Calendar, Users } from "lucide-react";

export default function Leaderboard() {
  const {
    data: entries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchleaderboardEntries,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-2">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-destructive font-medium">
              Failed to load leaderboard
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Please try again later
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedEntries = entries.sort(
    (a, b) => b.minutesFocused - a.minutesFocused,
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            Track your rankings and compare progress with others
          </p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
            <p className="text-muted-foreground">
              Be the first to join the leaderboard!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your rankings and compare progress with others
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {sortedEntries.length} users
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedEntries.map((entry, idx) => {
          const rank = idx + 1;
          return (
            <Card
              key={idx}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      <span className="text-lg font-bold text-muted-foreground">
                        #{rank}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{entry.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatMinutes(entry.minutesFocused)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {formatDate(entry.$createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      #{rank}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
