import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import ja from "@/lib/i18n";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const onSubmit = async (data: LoginForm) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setLocation("/");
    } else {
      toast({
        title: ja.common.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">
            {ja.auth.login}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("username")}
                placeholder={ja.auth.username}
              />
            </div>
            <div>
              <Input
                {...register("password")}
                type="password"
                placeholder={ja.auth.password}
              />
            </div>
            <Button type="submit" className="w-full">
              {ja.auth.login}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
