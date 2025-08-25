
"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Send, Upload } from "lucide-react";
import { useFavorites } from '@/context/favorites-context';
import type { Favorite } from '@/context/favorites-context';

export default function ContactsPage() {
    const { favorites } = useFavorites();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = favorites.filter(contact => 
        (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        contact.phone.includes(searchTerm)
    );

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Contacts</h1>
                    <p className="text-muted-foreground">Manage your saved contacts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Upload className="mr-2" />
                        Import Contacts
                    </Button>
                    <Button>
                        <Plus className="mr-2" />
                        Add Contact
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search contacts..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContacts.map((contact, index) => (
                    <Card key={index}>
                        <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`https://placehold.co/100x100.png?text=${contact.name ? contact.name.charAt(0) : 'C'}`} alt={contact.name || 'Contact'} />
                                <AvatarFallback>{contact.name ? contact.name.charAt(0) : 'C'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold text-lg">{contact.name || 'Unnamed Contact'}</p>
                                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            </div>
                             <div className="w-full flex gap-2">
                                <Button className="flex-1">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredContacts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">
                        {favorites.length > 0 ? "No contacts match your search." : "You haven't added any contacts yet."}
                    </p>
                </div>
            )}
        </div>
    );
}
