"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { DrizzleChat } from "@/app/lib/db/schema";
import { useState } from "react";

type Props = {
    chatId: number;
    chats: DrizzleChat[];
}

const MobileSidebar = ({ chatId, chats }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 bg-[#0a0a0a] border-gray-800 w-72">
                <Sidebar chatId={chatId} chats={chats} closeSheet={() => setIsOpen(false)} />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar;
